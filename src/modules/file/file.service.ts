import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { File } from './entities/file.entity';

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
