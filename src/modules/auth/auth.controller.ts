import { pick } from 'lodash';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
  HttpStatus, Get, Query, Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthMiddleware } from '../../common/guards/auth.middleware';
import { RegisterDto } from '../user/dto/register.dto';
import { LoginDto } from '../user/dto/login.dto';

import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

import { EmailError, UserError } from '../../common/errors';
import { EmailService } from '../email/email.service';
import { Emails } from '../email/email.templates';
import { AuthResponse } from '../../common/responses';

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

    const link = this.authService.signUrl(
      `${this.configService.get('BACKEND_HOST')}/auth/verifyEmail?id=${user.id}`,
      180000,
    );

    const options = Emails.VerificationOfAccount(data.email, link);
    await this.emailService.send(options);

    return {
      message: AuthResponse.SuccessfullySignedUp,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Post('/me')
  me(@CurrentUser() user: User) {
    return pick(user, ['email', 'name']);
  }

  @Get('/verifyEmail')
  async verifyEmail(@Req() req: Request, @Query('id') id: number) {
    this.authService.verifySignedUrl(`${this.configService.get('BACKEND_HOST')}${req.originalUrl}`);

    const user = await this.userService.findOneById(id);

    await this.userService.updateData({
      ...user,
      is_verified: true,
      verified_at: new Date(),
    });

    return {
      message: AuthResponse.SuccessfullyVerified,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Get('/verifyDeletion')
  async verifyDeletion(@Req() req: Request, @Query('id') id: number) {
    this.authService.verifySignedUrl(`${this.configService.get('BACKEND_HOST')}${req.originalUrl}`);

    await this.userService.deleteById(id);

    return {
      message: AuthResponse.SuccessfullyDeleted,
    };
  }
}
