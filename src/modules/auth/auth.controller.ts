import { pick } from 'lodash';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthMiddleware } from '../../common/guards/auth.middleware';
import { RegisterDto } from '../user/dto/register.dto';
import { LoginDto } from '../user/dto/login.dto';

import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

import { UserError } from '../../common/errors';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
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

    await this.authService.validate({
      password: data.password,
      hashPassword: user.password,
    });

    return this.authService.login(user);
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

    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthMiddleware)
  @Post('/me')
  me(@CurrentUser() user: User) {
    return pick(user, ['email', 'name']);
  }
}
