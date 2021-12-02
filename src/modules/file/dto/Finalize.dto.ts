import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FinalizeDto {
  // FIX: write custom decorator for checking object
  @ApiProperty({
    required: true,
    default: 5,
  })
  @IsNotEmpty()
  multipartUpload: any;
}
