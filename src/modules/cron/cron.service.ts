import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { addDaysToCurrentDate } from '../../common/helpers';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private fileService: FileService,
    private userService: UserService,
  ) {}

  @Cron('* * * * * *')
  async handleCron() {
    this.logger.debug(`${new Date()} auto cleanup'`);

    await this.userService.deleteMany(addDaysToCurrentDate(7));

    await this.fileService.deleteFilesByLastUpdated(addDaysToCurrentDate(1));

    await this.fileService.deleteMaliciousFiles(addDaysToCurrentDate(7));
  }
}
