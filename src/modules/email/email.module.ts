import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { EmailController } from './email.controller';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    forwardRef(() => AuthModule),
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
