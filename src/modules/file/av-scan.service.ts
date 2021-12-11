import { Inject, Injectable } from '@nestjs/common';

import { S3Service } from './s3.service';
import { FileService } from './file.service';
import { ScanResult, File } from './entities/file.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AvScanService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    @Inject('clamscan') private avScan,
  ) {
  }

  async check(id: number): Promise<File> {
    const fileDb = await this.fileService.findById(id);

    if (fileDb.scan_result !== ScanResult.PASSED) {
      let result: File;

      const {
        file,
        isInfected,
        viruses,
      } = await this.avScan.scanStream(this.s3Service.downloadReadStream({ filename: fileDb.filename }));

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

        const user = await this.userService.findOneById(fileDb.user_id);
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

      return result;
    }

    return fileDb;
  }
}
