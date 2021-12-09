import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { FileService } from './file.service';
import { S3Service } from './s3.service';
import { InitializeDto } from './dto/Initialize.dto';
import { ChunkDto } from './dto/Chunk.dto';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { AuthMiddleware } from '../../common/guards/auth.middleware';
import { FinalizeDto } from './dto/Finalize.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as Errors from "../../common/errors";

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Post()
  async initialize(@CurrentUser() user: User, @Body() data: InitializeDto) {
    const { UploadId } = await this.s3Service.init(
      data.extension,
      data.filename,
    );

    return this.fileService.save({
      ...data,
      user_id: user.id,
      s3_path: UploadId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Post('/:id/chunk')
  async chunk(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() data: ChunkDto,
  ) {
    const file = await this.fileService.findByIdAndUserId(id, user.id);

    await this.fileService.save({
      ...file,
      updated_at: new Date(),
    });

    return this.s3Service.chunk({
      UploadId: file.s3_path,
      PartNumber: data.partNumber,
      Body: data.body,
      filename: file.filename,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
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

    await this.fileService.save({
      ...file,
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

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Get('/:id/download')
  async download(@Res() res, @Param('id') id: number, @CurrentUser() user: User) {
    const file = await this.fileService.findByIdAndUserId(id, user.id);

    if (!file) {
      throw new HttpException(
          Errors.FileWithThisIdNotFound,
          HttpStatus.BAD_REQUEST,
      );
    }

    const s3File = await this.s3Service.download({
      extension: file.extension,
      filename: file.filename,
    });

    s3File.pipe(res);

    s3File.on('end', async () => {
      if (file.maxDownloadCount === file.downloadCount + 1) {
        await this.fileService.deleteById(file.id);
        await this.s3Service.delete({ filename: file.filename });
      } else {
        await this.fileService.save({
          ...file,
          lastDownloadAt: new Date(),
          downloadCount: file.downloadCount + 1,
        });
      }
    });
  }
}
