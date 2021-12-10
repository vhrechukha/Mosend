import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app.config.module';
import { DbProviderModule } from './providers/db.provider';
import { RedisCacheModule } from './modules/redisCache/redisCache.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AllExceptionsFilter } from './common/errors/all-exceptions.filter';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    AppConfigModule,
    DbProviderModule,
    UserModule,
    AuthModule,
    RedisCacheModule,
    FileModule,
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
