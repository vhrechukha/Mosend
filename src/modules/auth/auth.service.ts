import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as Errors from '../../common/errors';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validate({ password, hashPassword }): Promise<any> {
    const result = await bcrypt.compare(password, hashPassword);

    if (result) return result;

    throw new HttpException(
      Errors.UserWithEmailNotFound,
      HttpStatus.BAD_REQUEST,
    );
  }

  async login(user) {
    return {
      access_token: this.jwtService.sign(
        {},
        {
          subject: user.id.toString(),
          jwtid: v4(),
        },
      ),
    };
  }

  async verifyToken(token) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return false;
    }
  }
}
