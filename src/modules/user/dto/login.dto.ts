import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    required: true,
    default: 'cat@email.com',
  })
  email: number;

  @ApiProperty({
    required: true,
    default: 'someSecurePassword123',
  })
  password: string;
}
