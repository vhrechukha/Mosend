import {
  Controller, Get, HttpException, HttpStatus, Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmailService } from './email.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

import { Emails } from './email.templates';
import { EmailError } from '../../common/errors';
import { EmailResponse } from '../../common/responses';

@Controller('email')
export class EmailController {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/resendVerificationEmail')
  async resendEmailVerification(
  // @Param('type') type: EmailTypes, // FEAT: for feature emails which need just to resend
  @Query('email') email: string,
  ) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const validatedEmail = emailRegex.test(email);

    if (!validatedEmail) {
      throw new HttpException(
        EmailError.EmailIsNotCorrect,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const link = this.authService.signUrl(
        `${this.configService.get('BACKEND_HOST')}/auth/verifyEmail?id=${user.id}`,
        180000,
      );

      const options = Emails.verificationEmail(email, link);
      await this.emailService.send(options);
    }

    return {
      message: EmailResponse.EmailSent,
    };
  }
}
