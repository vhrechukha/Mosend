import { pick } from 'lodash';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthMiddleware } from '../../common/guards/auth.middleware';
import { RegisterDto } from '../user/dto/register.dto';
import { LoginDto } from '../user/dto/login.dto';

import { UserD } from '../../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

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
        'User with this email not found.',
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
        'User is already exists.',
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
  me(@UserD() user: User) {
    return pick(user, ['email', 'name']);
  }
}
