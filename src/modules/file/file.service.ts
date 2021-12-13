import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

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

  findById(chunkId) {
    return this.repository.findOne({
      where: {
        id: chunkId,
      },
    });
  }

  findByIdAndUserId(chunkId, user) {
    return this.repository.findOne({
      where: {
        id: chunkId,
        user,
      },
    });
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
}
