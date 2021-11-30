import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    required: true,
    default: 'Myrka',
  })
  name: string;

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
