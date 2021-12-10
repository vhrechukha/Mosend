import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {
  CheckObjectOnSpecificProperties,
} from '../../../common/validationDecorators/CheckObjectOnSpecificProperties.decorator';

export class FinalizeDto {
  // FIX: write custom decorator for checking object
  @CheckObjectOnSpecificProperties(['Parts', ['PartNumber', 'ETag']])
  @ApiProperty({
    required: true,
    default: 5,
  })
  @IsNotEmpty()
    multipartUpload: any;
}
