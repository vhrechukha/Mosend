import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validate({ password, hashPassword }): Promise<any> {
    const result = await bcrypt.compare(password, hashPassword);

    if (result) return result;

    throw new Error('Password or email is incorrect.');
  }

  async login(user) {
    console.log(user);
    return {
      access_token: this.jwtService.sign({
        id: user.id,
      }),
    };
  }

  async verifyToken(token) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      console.log(e)
      return false;
    }
  }
}
