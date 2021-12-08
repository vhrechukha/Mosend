import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { S3Service } from './s3.service';
import NodeClam from 'clamscan';
import { FileService } from './file.service';
import { ScanResult, File } from './entities/file.entity';

@Injectable()
export class AvScanService {
    private avScan;
    constructor(
        private readonly s3Service: S3Service,
        private readonly fileService: FileService,
    ) {
        this.avScan = new NodeClam().init({
            debugMode: true,
            // prettier-ignore
            clamdscan: {
                // Run scan using command line
                path: '/usr/bin/clamdscan',
                configFile: '/etc/clamd.d/daemon.conf',
                // Connect via Host/Port
                host: 'localhost',
                port: 3310,
                // Connect via socket (preferred)
                active: true,
            },
            preference: 'clamdscan',
         });
    }

    async check(id: number): Promise<File> {
        const fileDb = await this.fileService.findById(id);

        if (fileDb.scan_result !== ScanResult.PASSED) {
            let result: File;

            await new Promise(res => {
                const fileWriteStream = fs.createWriteStream(`./src/files/${fileDb.filename}.${fileDb.extension}`);
                this.s3Service.downloadReadStream({ filename: fileDb.filename }).pipe(fileWriteStream);

                fileWriteStream.on('finish', res);
            });

            const { file, isInfected, viruses } = await this.avScan.then(av => av.isInfected(`./src/files/${fileDb.filename}.${fileDb.extension}`));

            if (isInfected) {
                await this.s3Service.delete({
                    filename: fileDb.filename,
                });

                result = await this.fileService.save({
                    ...file,
                    s3_path: null,
                    scan_result: ScanResult.MALICIOUS,
                    last_scan_date: new Date(),
                    scan_detection_info: JSON.parse(viruses),
                });

                // FEATURE: suspend user account
            } else if (!isInfected) {
                const file = await this.fileService.findById(id);
                result = await this.fileService.save({
                    ...file,
                    scan_result: ScanResult.PASSED,
                    last_scan_date: new Date(),
                });
            }

            // Remove the file (for good measure)
            if (fs.existsSync(`./src/files/${fileDb.filename}.${fileDb.extension}`)) fs.unlinkSync(`./src/files/${fileDb.filename}.${fileDb.extension}`);

            return result;
        }


        return fileDb;
    }
}
