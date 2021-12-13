import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    required: true,
    default: 'currentPassword',
  })
  @IsNotEmpty()
    password: string;

  @ApiProperty({
    required: true,
    default: 'newPassword',
  })
  @IsNotEmpty()
    newPassword: string;
}
