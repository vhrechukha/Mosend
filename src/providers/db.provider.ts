import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppConfigService } from '../config/app.config.service';
import { AppConfigModule } from '../config/app.config.module';
import { User } from '../modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        keepConnectionAlive: true,
        type: 'postgres' as DatabaseType,
        host: appConfigService.get('DB_HOST'),
        port: appConfigService.get('DB_PORT'),
        username: appConfigService.get('DB_USERNAME'),
        password: appConfigService.get('DB_PASSWORD'),
        database: appConfigService.get('DB_DATABASE'),
        entities: [User],
        synchronize: false,
      }),
      inject: [AppConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class DbProviderModule {}
