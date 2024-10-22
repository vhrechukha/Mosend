import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app.config.module';
import { DbProviderModule } from './providers/db.provider';
import { AllExceptionsFilter } from './common/errors/all-exceptions.filter';

import { RedisCacheModule } from './modules/redisCache/redisCache.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { EmailModule } from './modules/email/email.module';
import { CronModule } from './modules/cron/cron.module';
import { BullProviderModule } from './providers/bull.provider';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    AppConfigModule,
    DbProviderModule,
    BullProviderModule,
    ReportModule,
    UserModule,
    AuthModule,
    FileModule,
    EmailModule,
    RedisCacheModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
