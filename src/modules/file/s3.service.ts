import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private s3: any;

  constructor(private readonly configService: ConfigService) {
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

  chunk({
    UploadId,
    PartNumber,
    Body,
    filename,
  }: {
    UploadId: string;
    PartNumber: number;
    Body: Readable;
    filename: string;
  }) {
    return this.s3.upload({
      Body,
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: filename,
      PartNumber,
      UploadId,
    }).promise();
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

  downloadReadStream({
    filename,
  }: {
    extension?: string;
    filename: string;
  }): Readable {
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
