import {
  Controller, Get, HttpException, HttpStatus, Query, UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

import { Emails, EmailsForResetting, pathOfEmailsForResetting } from './email.templates';
import { EmailError } from '../../common/errors';
import { EmailResponse } from '../../common/responses';
import { AuthMiddleware } from '../../common/guards/auth.middleware';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('email')
export class EmailController {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/resendEmail')
  async resendEmail(
    @Query('type') type: EmailsForResetting,
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
        `${this.configService.get('BACKEND_HOST')}/auth/${pathOfEmailsForResetting[type]}?id=${user.id}`,
        180000,
      );

      const options = Emails[type](email, link);
      await this.emailService.send(options);
    }

    return {
      message: EmailResponse[type],
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Get('/sendDeletionEmail')
  async sendDeletionEmail(@CurrentUser() user: User) {
    const link = this.authService.signUrl(
      `${this.configService.get('BACKEND_HOST')}/auth/verifyDeletion?id=${user.id}`,
      180000,
    );

    const options = Emails.DeletionOfAccount(user.email, link);
    await this.emailService.send(options);

    return {
      message: EmailResponse.DeletionEmailSent,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Get('/sendEmailForChange')
  async sendEmailForChange(@CurrentUser() user: User) {
    const link = this.authService.signUrl(
      `${this.configService.get('BACKEND_HOST')}/auth/changeEmail?id=${user.id}`,
      180000,
    );

    const options = Emails.ChangingEmailOfAccount(user.email, link);
    await this.emailService.send(options);

    return {
      message: EmailResponse.ChangeEmail,
    };
  }
}
