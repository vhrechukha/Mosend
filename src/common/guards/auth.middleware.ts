import {
  Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../modules/user/user.service';
import { EmailError, UserError } from '../errors';

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
          UserError.UserSuspended,
          HttpStatus.FORBIDDEN,
        );
      }

      if (!user?.is_verified) {
        throw new HttpException(
          EmailError.EmailIsNotVerified,
          HttpStatus.FORBIDDEN,
        );
      }

      request.user = user;
    }

    return payload;
  }
}
