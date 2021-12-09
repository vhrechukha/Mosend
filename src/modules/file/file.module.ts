import NodeClam from 'clamscan';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { FileController } from './file.controller';
import { S3Service } from './s3.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AvScanService } from './av-scan.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ConfigModule,
    UserModule,
    AuthModule,
  ],
  controllers: [FileController],
  providers: [FileService, S3Service, AvScanService, {
    provide: 'clamscan',
    useFactory: async (configService: ConfigService) => await (new NodeClam()).init({
      debugMode: true,
      clamdscan: {
        // Connect via Host/Port
        host: configService.get('CLAMDSCAN_HOST'),
        port: configService.get('CLAMDSCAN_PORT'),
        // Connect via socket (preferred)
        active: true,
      },
      preference: 'clamdscan',
    }),
    inject: [ConfigService]
  }],
})
export class FileModule {}
