import {
  Body, Controller, Delete, Get, HttpException,
  HttpStatus, Param, Post, Query, Req, Res,
  UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { Request, Response } from 'express';
import { Queue } from 'bull';

import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { S3Service } from './s3.service';

import { InitializeDto } from './dto/Initialize.dto';
import { FinalizeDto } from './dto/Finalize.dto';

import { FileError } from '../../common/errors';
import { User } from '../user/entities/user.entity';

import { CurrentUser } from '../../common/decorators/user.decorator';
import { AuthMiddleware } from '../../common/guards/auth.middleware';
import { FileResponsesTypes } from '../../common/responses';
import { CheckLimitMiddleware } from '../../common/guards/checkLimit.middleware';
import { RedisCacheService } from '../redisCache/redisCache.service';
import { AuthService } from '../auth/auth.service';

@Controller('file')
export class FileController {
  private backendHost = this.configService.get('BACKEND_HOST');

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
    private readonly redisService: RedisCacheService,
    @InjectQueue('av-scan')
    private readonly avScanQueue: Queue,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Get()
  async getAll(
    @CurrentUser() user: User,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return this.fileService.findManyByUserId(user.id, skip, take);
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware, CheckLimitMiddleware)
  @Post()
  async initialize(@CurrentUser() user: User, @Body() data: InitializeDto) {
    const { UploadId } = await this.s3Service.init(
      data.extension,
      data.filename,
    );

    return this.fileService.save({
      ...data,
      user: user.id,
      s3_path: UploadId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware, CheckLimitMiddleware)
  @UseInterceptors(FileInterceptor('body'))
  @Post('/:id/chunk')
  async chunk(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @UploadedFile() body,
    @Body('partNumber') partNumber: number,
  ) {
    const file = await this.fileService.findByIdAndUserId(id, user.id);

    const result = await this.s3Service.chunk({
      user: {
        f_size_max: user.f_size_max,
        id: user.id,
      },
      file: {
        id: file.id,
        filename: file.filename,
        extension: file.extension,
      },
      UploadId: file.s3_path,
      PartNumber: partNumber,
      Body: body.buffer,
    });

    await this.fileService.save({
      ...file,
      updated_at: new Date(),
    });

    return result;
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware, CheckLimitMiddleware)
  @Post('/:id/finalize')
  async finalize(
  @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() data: FinalizeDto,
  ) {
    const file = await this.fileService.findByIdAndUserId(id, user.id);
    const final = await this.s3Service.finalize({
      MultipartUpload: data.multipartUpload,
      UploadId: file.s3_path,
      filename: file.filename,
    });

    const filesize = await this.redisService.get(file.id);

    await this.fileService.save({
      ...file,
      filesize,
      s3_status: 'finished',
    });

    return final;
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Get('/:id')
  async get(@Param('id') id: number, @CurrentUser() user: User) {
    return this.fileService.findByIdAndUserId(id, user.id);
  }

  @Get('/:id/download')
  async download(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    this.authService.verifySignedUrl(`${this.backendHost}${req.originalUrl}`);

    const file = await this.fileService.findById(id);

    if (!file) {
      throw new HttpException(
        FileError.FileWithThisIdNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    const s3File = await this.s3Service.download({
      extension: file.extension,
      filename: file.filename,
    });

    s3File.pipe(res);

    s3File.on('end', async () => {
      if (file.max_download_count === file.download_count + 1) {
        await this.fileService.deleteById(file.id);
        await this.s3Service.delete({ filename: file.filename });
      } else {
        await this.fileService.save({
          ...file,
          last_download_at: new Date(),
          download_count: file.download_count + 1,
        });
      }
    });
  }

  @UseGuards(AuthMiddleware)
  @Delete('/:id')
  async delete(
    @Param('id') id: number,
  ) {
    return this.fileService.deleteById(id);
  }

  @Post('/:id/report')
  async report(
    @Param('id') id: number,
  ) {
    await this.avScanQueue.add('check', {
      id,
    });

    return {
      mCode: FileResponsesTypes.SCHEDULED_FOR_CHECK,
    };
  }

  @UseGuards(AuthMiddleware)
  @Post('/share/:id')
  async share(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ) {
    const file = await this.fileService.findByIdAndUserId(id, user.id);

    if (!file) {
      throw new HttpException(
        FileError.FileWithThisIdNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      link: this.authService.signUrl(
        `${this.backendHost}/file/${id}/download`,
        180000,
      ),
    };
  }
}
