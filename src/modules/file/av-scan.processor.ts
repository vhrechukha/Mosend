import { Inject, Logger } from '@nestjs/common';
import {
  OnQueueCompleted, Process, Processor,
} from '@nestjs/bull';
import { Job } from 'bull';

import { S3Service } from './s3.service';
import { FileService } from './file.service';
import { ScanResult, File } from './entities/file.entity';
import { UserService } from '../user/user.service';

@Processor('av-scan')
export class AvScanProcessor {
  private readonly logger = new Logger(AvScanProcessor.name);

  constructor(
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    @Inject('clamscan') private avScan,
  ) {}

  @OnQueueCompleted()
  async onQueueCompleted(jobId: number, result: any) {
    // FEAT: added action for front-end when file checked
    return result;
  }

  @Process('check')
  async check(job: Job) {
    this.logger.debug(`${new Date()} av started scanning, id: ${job.data.id}`);

    const fileDb = await this.fileService.findById(job.data.id);

    if (fileDb && fileDb.scan_result !== ScanResult.PASSED) {
      let result: File;

      const {
        file,
        isInfected,
        viruses,
      } = await this.avScan.scanStream(this.s3Service.download({ filename: fileDb.filename }));

      if (isInfected) {
        await this.s3Service.delete({
          filename: fileDb.filename,
        });

        result = await this.fileService.save({
          ...fileDb,
          ...file,
          s3_path: null,
          scan_result: ScanResult.MALICIOUS,
          last_scan_date: new Date(),
          scan_detection_info: String(...viruses),
        });

        const user = await this.userService.findOneById(fileDb.user);
        await this.userService.updateData({
          ...user,
          suspended: true,
          suspendedAt: new Date(),
          suspensionReason: String(...viruses), // is this what means by suspended reason for user?
        });
      } else if (!isInfected) {
        result = await this.fileService.save({
          ...file,
          ...fileDb,
          scan_result: ScanResult.PASSED,
          last_scan_date: new Date(),
        });
      }
      this.logger.debug(`${new Date()} av scanned, id: ${job.data.id}`);

      return result;
    }

    this.logger.debug(`${new Date()} av scanned, id: ${job.data.id}`);

    return fileDb;
  }
}
