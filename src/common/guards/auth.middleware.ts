import {
  Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class AuthMiddleware implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();

    const payload = await this.authService.verifyToken(
      request.headers?.authorization?.split(' ')?.[1],
    );

    if (payload?.sub) {
      const user = await this.userService.findOneById(payload.sub);

      if (user?.suspended) {
        throw new HttpException(
          'This user was suspended.',
          HttpStatus.FORBIDDEN,
        );
      }

      request.user = user;
    }

    return payload;
  }
}
