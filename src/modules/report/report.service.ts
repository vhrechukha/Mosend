import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entitites/Report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private repository: Repository<Report>,
  ) {}

  async save(data) {
    return this.repository.save({
      ...data,
    });
  }
}
