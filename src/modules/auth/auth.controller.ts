import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthMiddleware } from '../../common/guards/auth.middleware';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  async login(@Body('email') email, @Body('password') password) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new Error('User with this email not found.');

    await this.authService.validate({
      password,
      hashPassword: user.password,
    });

    return this.authService.login(user);
  }

  @Post('/register')
  async register(
    @Body('email') email,
    @Body('password') password,
    @Body('name') name,
  ) {
    const userExists = await this.userService.findOneByEmail(email);

    if (userExists) {
      throw new Error('User is already exists.');
    }

    const user = await this.userService.save({
      email,
      password,
      name,
    });

    return this.authService.login(user);
  }

  @UseGuards(AuthMiddleware)
  @Post('/me')
  me(@Request() req) {
    return this.userService.findOneById(req.userId);
  }
}
