import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileError } from 'src/common/errors';
import {
  LessThan, LessThanOrEqual, MoreThanOrEqual, Repository,
} from 'typeorm';

import {
  File,
  ScanResult,
} from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private repository: Repository<File>,
  ) {}

  async save(data) {
    return this.repository.save({
      ...data,
    });
  }

  async findById(chunkId) {
    const file = await this.repository.findOne({
      where: {
        id: chunkId,
        expires_in: MoreThanOrEqual(null),
      },
    });

    if (file.expires_in >= new Date() || !file.expires_in) {
      return file;
    }

    throw new HttpException(
      FileError.FileWithThisIdNotFound,
      HttpStatus.BAD_REQUEST,
    );
  }

  async findByIdAndUserId(chunkId, user) {
    const file = await this.repository.findOne({
      where: {
        user,
        id: chunkId,
        expires_in: MoreThanOrEqual(new Date() || null),
      },
    });

    if (file.expires_in >= new Date() || !file.expires_in) {
      return file;
    }

    throw new HttpException(
      FileError.FileWithThisIdNotFound,
      HttpStatus.BAD_REQUEST,
    );
  }

  deleteById(chunkId) {
    return this.repository.delete(chunkId);
  }

  deleteFilesByLastUpdated(time: Date) {
    return this.repository.delete({
      updated_at: LessThanOrEqual(time),
    });
  }

  deleteMaliciousFiles(time: Date) {
    return this.repository.delete({
      last_scan_date: LessThanOrEqual(time),
      scan_result: ScanResult.MALICIOUS,
    });
  }

  deleteExpiredFiles() {
    return this.repository.delete({
      expires_in: LessThan(new Date()),
    });
  }
}
