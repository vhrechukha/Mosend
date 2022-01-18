import {
  Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from '../../modules/user/user.service';
import { UserError } from '../errors';
import { FileService } from '../../modules/file/file.service';

@Injectable()
export class CheckLimitMiddleware implements CanActivate {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();

    const userId = request.user.id;

    const user = await this.userService.findOneById(userId);
    const { size, count } = await this.fileService.getInfoAboutFullnesOfLimits(userId);

    if (user.f_count_max < count || Number(user.f_size_max) < Number(size)) {
      throw new HttpException(
        UserError.LimitExceeded,
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
