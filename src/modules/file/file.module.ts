import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { FileController } from './file.controller';
import { S3Service } from './s3.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ConfigModule,
    UserModule,
    AuthModule,
  ],
  controllers: [FileController],
  providers: [FileService, S3Service],
})
export class FileModule {}
