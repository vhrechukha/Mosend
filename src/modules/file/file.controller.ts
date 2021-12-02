import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { S3Service } from './s3.service';
import { InitializeDto } from './dto/Initialize.dto';
import { ChunkDto } from './dto/Chunk.dto';
import { User } from '../user/entities/user.entity';
import { UserD } from '../../common/decorators/user.decorator';
import { AuthMiddleware } from '../../common/guards/auth.middleware';
import { FinalizeDto } from './dto/Finalize.dto';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
  ) {}

  @UseGuards(AuthMiddleware)
  @Post()
  async initialize(@UserD() user: User, @Body() data: InitializeDto) {
    const { UploadId } = await this.s3Service.init(
      data.extension,
      data.filename,
    );

    const file = await this.fileService.save({
      ...data,
      user_id: user.id,
      s3_path: UploadId,
    });

    return file;
  }

  @UseGuards(AuthMiddleware)
  @Post('/:id/chunk')
  async chunk(
    @Param('id') id: number,
    @UserD() user: User,
    @Body() data: ChunkDto,
  ) {
    const { s3_path, filename } = await this.fileService.findByIdAndUserId(
      id,
      user.id,
    );

    // FIX: added update time in db for file

    return this.s3Service.chunk({
      UploadId: s3_path,
      PartNumber: data.partNumber,
      Body: data.body,
      filename: filename,
    });
  }

  @UseGuards(AuthMiddleware)
  @Post('/:id/finalize')
  async finalize(
    @Param('id') id: number,
    @UserD() user: User,
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

  @UseGuards(AuthMiddleware)
  @Get('/:id')
  async get(@Param('id') id: number, @UserD() user: User) {
    return this.fileService.findByIdAndUserId(id, user.id);
  }

  @UseGuards(AuthMiddleware)
  @Get('/:id/download')
  async download(@Param('id') id: number, @UserD() user: User) {
    const { extension, filename } = await this.fileService.findByIdAndUserId(
      id,
      user.id,
    );

    return this.s3Service.download({
      extension,
      filename,
    });
  }
}
