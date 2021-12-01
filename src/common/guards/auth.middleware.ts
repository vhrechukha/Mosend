import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class AuthMiddleware implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const payload = await this.authService.verifyToken(
      request.headers.authorization.split(' ')[1],
    );

    if (payload?.id) {
      request.user = await this.userService.findOneById(payload.id);
    }

    return payload;
  }
}
