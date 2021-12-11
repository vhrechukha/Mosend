import { pick } from 'lodash';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
  HttpStatus, Get, Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthMiddleware } from '../../common/guards/auth.middleware';
import { RegisterDto } from '../user/dto/register.dto';
import { LoginDto } from '../user/dto/login.dto';

import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

import { AppError, EmailError, UserError } from '../../common/errors';
import { EmailService } from '../email/email.service';
import { Emails } from '../email/email.templates';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  @Post('/login')
  async login(@Body() data: LoginDto) {
    const user = await this.userService.findOneByEmail(data.email);

    if (!user) {
      throw new HttpException(
        UserError.UserWithEmailNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user?.is_verified) {
      throw new HttpException(
        EmailError.EmailIsNotVerified,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.authService.validate({
      password: data.password,
      hashPassword: user.password,
    });

    return this.authService.signToken(user, 360000);
  }

  @Post('/register')
  async register(@Body() data: RegisterDto) {
    const userExists = await this.userService.findOneByEmail(data.email);

    if (userExists) {
      throw new HttpException(
        UserError.UserIsAlreadyExists,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.save({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    const { token } = await this.authService.signToken(user, 360);
    const link = `${this.configService.get('BACKEND_HOST')}/auth/verifyEmail?token=${token}`;

    const options = Emails.verificationEmail(data.email, link);
    await this.emailService.send(options);

    return {
      message: 'You logged in successfully. Please, verify your email at first.',
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Post('/me')
  me(@CurrentUser() user: User) {
    return pick(user, ['email', 'name']);
  }

  @Get('/verifyEmail')
  async verifyEmail(@Query('token') token: string) {
    const payload = await this.authService.verifyToken(token);

    if (!payload?.sub) {
      throw new HttpException(
        AppError.TokenIsNotActive,
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.findOneById(payload.sub);

    if (user?.suspended) {
      throw new HttpException(
        UserError.UserSuspended,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.userService.updateData({
      ...user,
      is_verified: true,
    });

    return {
      message: 'User was successfully verified. Yet, you can login with your email and password.',
    };
  }
}
