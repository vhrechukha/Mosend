import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReportDto {
  @ApiProperty({
    required: true,
    default: 'Hello! I think this file is bad. Please, review it.',
  })
  @IsNotEmpty()
  @IsString()
    message: string;
}
