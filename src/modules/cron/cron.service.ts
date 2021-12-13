import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private fileService: FileService,
    private userService: UserService,
  ) {}

  @Cron('0 0 24 * * *')
  async handleCron() {
    this.logger.debug(`${new Date()} auto cleanup'`);

    await this.userService.deleteMany(7);

    await this.fileService.deleteFilesByLastUpdated(1);

    await this.fileService.deleteMaliciousFiles(7);
  }
}
