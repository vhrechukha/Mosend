import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { AWSError } from 'aws-sdk/lib/error';
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
    return new Promise((res, rej) =>
      this.s3.createMultipartUpload(
        {
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: filename,
          ContentType,
        },
        (err: AWSError, data: S3.Types.CreateMultipartUploadOutput) =>
          err ? rej(err) : res(data),
      ),
    );
  }

  async chunk({
    UploadId,
    PartNumber,
    Body,
    filename,
  }: {
    UploadId: string;
    PartNumber: number;
    Body: Buffer | Uint8Array | Blob | string | Readable;
    filename: string;
  }): Promise<S3.Types.UploadPartOutput> {
    return new Promise((res, rej) =>
      this.s3.uploadPart(
        {
          Body,
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: filename,
          PartNumber,
          UploadId,
        },
        (err: AWSError, data) => {
          if (err) {
            rej(err);
          }
          res({ ...data });
        },
      ),
    );
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
    return new Promise((res, rej) =>
      this.s3.completeMultipartUpload(
        {
          UploadId,
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: filename,
          MultipartUpload,
        },
        (err: AWSError, data) => {
          if (err) rej(err);
          res(data);
        },
      ),
    );
  }

  async download({
    filename,
  }: {
    extension: string;
    filename: string;
  }): Promise<S3.Types.GetObjectOutput> {
    return new Promise((res, rej) =>
      this.s3.getObject(
        {
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: filename,
        },
        (err: AWSError, data) => {
          if (err) rej(err);
          res(data);
        },
      ),
    );
  }

  delete({
    filename,
  }: {
    filename: string;
  }): Promise<S3.Types.GetObjectOutput> {
    return new Promise((res, rej) =>
      this.s3.deleteObject(
        {
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: filename,
        },
        (err: AWSError, data) => {
          if (err) rej(err);
          res(data);
        },
      ),
    );
  }
}
