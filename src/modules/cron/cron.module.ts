import { Module } from '@nestjs/common';

import { CronService } from './cron.service';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [UserModule, FileModule],
  providers: [CronService],
})
export class CronModule {}
