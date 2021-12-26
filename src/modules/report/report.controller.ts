import {
  Body, Controller, Param, Post, Req,
} from '@nestjs/common';
import { Request } from 'express';

import { ReportDto } from './dto/Report.dto';

import { FileResponsesTypes } from '../../common/responses';
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
      mCode: FileResponsesTypes.SCHEDULED_FOR_CHECK,
    };
  }
}
