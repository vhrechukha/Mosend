import {
  Body, Controller, Param, Post, Req,
} from '@nestjs/common';
import { Request } from 'express';

import { ReportDto } from './dto/Report.dto';

import { FileResponse } from '../../common/responses';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) {}

  @Post('/:id')
  async report(
  @Param('id') id: number,
    @Req() req: Request,
    @Body() data: ReportDto,
  ) {
    await this.reportService.save({
      ...data,
      file: id,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    return {
      message: FileResponse.ScheduledForCheck,
    };
  }
}
