import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    default: 'cat@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: number;

  @ApiProperty({
    required: true,
    default: 'someSecurePassword123',
  })
  @IsNotEmpty()
  password: string;
}
