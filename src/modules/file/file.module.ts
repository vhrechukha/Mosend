import NodeClam from 'clamscan';
import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { FileController } from './file.controller';
import { S3Service } from './s3.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AvScanProcessor } from './av-scan.processor';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([File]),
    BullModule.registerQueueAsync({
      name: 'av-scan',
    }),
  ],
  controllers: [FileController],
  providers: [FileService, S3Service, AvScanProcessor, {
    provide: 'clamscan',
    useFactory: async (configService: ConfigService) => (new NodeClam()).init({
      debugMode: true,
      clamdscan: {
        host: configService.get('CLAMDSCAN_HOST'),
        port: configService.get('CLAMDSCAN_PORT'),
        active: true,
      },
      preference: 'clamdscan',
    }),
    inject: [ConfigService],
  }],
  exports: [FileService, AvScanProcessor],
})
export class FileModule {}
