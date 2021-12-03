import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  private s3: any;

  constructor(
    @InjectRepository(File)
    private repository: Repository<File>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async save(data) {
    return this.repository.save({
      ...data,
    });
  }

  findByIdAndUserId(chunkId, user_id) {
    return this.repository.findOne({
      where: {
        id: chunkId,
        user_id,
      },
    });
  }

  deleteById(chunkId) {
    return this.repository.delete(chunkId);
  }
}
