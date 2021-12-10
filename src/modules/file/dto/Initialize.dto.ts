import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitializeDto {
  @ApiProperty({
    required: true,
    default: 'application/pdf',
  })
  @IsNotEmpty()
  @IsString()
    contentType: string;

  @ApiProperty({
    required: true,
    default: 'pdf',
  })
  @IsNotEmpty()
  @IsString()
    extension: string;

  @ApiProperty({
    required: true,
    default: 'Document',
  })
  @IsNotEmpty()
  @IsString()
    filename: string;

  @ApiProperty({
    required: true,
    default: 18,
  })
  @IsNotEmpty()
    chunkCount: number;

  @ApiProperty({
    required: true,
    default: '5600',
  })
  @IsNotEmpty()
    chunkSize: number;

  @ApiProperty({
    required: true,
    default: '2',
  })
  @IsOptional()
    maxDownloadCount: number;

  @ApiProperty({
    required: true,
    default: '5000',
  })
  @IsNotEmpty()
    filesize: number;
}
