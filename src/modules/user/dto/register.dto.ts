import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    required: true,
    default: 'Myrka',
  })
  @IsNotEmpty()
  @IsString()
    name: string;

  @ApiProperty({
    required: true,
    default: 'cat@email.com',
  })
  @IsEmail()
    email: number;

  @ApiProperty({
    required: true,
    default: 'someSecurePassword123',
  })
  @IsNotEmpty()
    password: string;
}
