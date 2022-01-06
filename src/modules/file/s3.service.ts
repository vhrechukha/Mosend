import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import path from 'path';
import * as os from 'os';
import fs from 'fs';

import { UserError } from '../../common/errors';
import { RedisCacheService } from '../redisCache/redisCache.service';

@Injectable()
export class S3Service {
  private s3: S3;

  private tmpDir: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisCacheService,
  ) {
    this.tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mosend'));
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async init(
    ContentType: string,
    filename: string,
  ): Promise<S3.Types.CreateMultipartUploadOutput> {
    return this.s3.createMultipartUpload({
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: filename,
      ContentType,
    }).promise();
  }

  async chunk({
    UploadId,
    PartNumber,
    Body,
    file,
    user,
  }: {
    user: {
      f_size_max: number;
      id: number;
    };
    file: {
      id: number;
      filename: string,
      extension: string,
    },
    UploadId: string;
    PartNumber: number;
    Body: Buffer;
    ContentLength: number;
  }): Promise<{ data: S3.UploadPartOutput }> {
    const newFileLength = await this.redisService.incrBy(file.id, Body.length);

    if (newFileLength > user.f_size_max) {
      throw new HttpException(
        UserError.LimitExceeded,
        HttpStatus.FORBIDDEN,
      );
    }

    const data = await this.s3.uploadPart({
      Body,
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      ContentLength: Body.length,
      Key: file.filename,
      PartNumber,
      UploadId,
    })
      .promise();

    return {
      data,
    };
  }

  async finalize({
    UploadId,
    MultipartUpload,
    filename,
  }: {
    UploadId: string;
    MultipartUpload: any;
    filename: string;
  }): Promise<S3.Types.CompleteMultipartUploadOutput> {
    return this.s3.completeMultipartUpload({
      UploadId,
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: filename,
      MultipartUpload,
    }).promise();
  }

  download({
    filename,
  }: {
    extension?: string;
    filename: string;
  }) {
    return this.s3.getObject({
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: filename,
    }).createReadStream();
  }

  delete({
    filename,
  }: {
    filename: string;
  }): Promise<S3.Types.GetObjectOutput> {
    return this.s3.deleteObject({
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: filename,
    }).promise();
  }
}
