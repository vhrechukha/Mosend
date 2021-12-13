import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AppConfigService } from '../config/app.config.service';
import { AppConfigModule } from '../config/app.config.module';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        limiter: {
          max: 5,
          duration: 300,
        },
        redis: {
          host: appConfigService.get('REDIS_HOST'),
          port: appConfigService.get('REDIS_PORT'),
        },
        defaultJobOptions: {
          timeout: 100,
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 2,
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  exports: [BullModule],
})
export class BullProviderModule {}
