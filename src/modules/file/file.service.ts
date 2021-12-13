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

  deleteFilesByLastUpdated(days: number) {
    return this.repository.delete({
      updated_at: LessThanOrEqual(new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000)),
    });
  }

  deleteMaliciousFiles(days: number) {
    return this.repository.delete({
      last_scan_date: LessThanOrEqual(new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000)),
      scan_result: ScanResult.MALICIOUS,
    });
  }
}
