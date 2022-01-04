import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { S3 } from 'aws-sdk';
import path from 'path';
import * as os from 'os';
import fs from 'fs';

import { UserError } from '../../common/errors';
import { RedisCacheService } from '../redisCache/redisCache.service';

@Injectable()
export class S3Service {
  private s3: any;

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
    files,
    UploadId,
    PartNumber,
    Body,
    file,
    user,
  }: {
    files: any,
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
    Body: Readable;
    ContentLength: number;
  }): Promise<{
      data: {
        ServerSideEncryption: string;
        ETag: string;
      };
      filesize: number;
    }> {
    return new Promise(async (res, rej) => {
      const anotherFiles = files.filter((e) => e !== file.id);
      const bytesInAnotherFiles = await anotherFiles.reduce(async (acc, e) => {
        const filebytes = await this.redisService.get(e.id);

        return (await acc) + filebytes;
      }, 0);

      const read = Readable.from(Body, { highWaterMark: 5000 });

      const bytesSize = await this.redisService.get(file.id);

      const filenameLocal = path.join(this.tmpDir, `${new Date().getTime()}-${Math.random() * 10}.${file.extension}`);

      const write = fs.createWriteStream(filenameLocal);

      let filesize = 0;
      read.on('data', async (chunk) => {
        filesize += chunk.length;

        const possibleBytesSize = bytesSize + filesize + bytesInAnotherFiles;
        if (possibleBytesSize > user.f_size_max) {
          rej(new HttpException(
            UserError.LimitExceeded,
            HttpStatus.FORBIDDEN,
          ));
        }

        await this.redisService.incrBy(file.id, filesize);
      });

      read.pipe(write);

      const data = await this.s3.uploadPart({
        Body: read,
        ContentLength: filesize,
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: file.filename,
        PartNumber,
        UploadId,
      })
        .promise();

      await fs.unlinkSync(filenameLocal);

      res({
        data,
        filesize,
      });
    });
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
