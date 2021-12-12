import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

import { AppError, UserError } from '../../common/errors';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validate({ password, hashPassword }): Promise<any> {
    const result = await bcrypt.compare(password, hashPassword);

    if (result) return result;

    throw new HttpException(
      UserError.UserWithEmailNotFound,
      HttpStatus.BAD_REQUEST,
    );
  }

  async signToken(user, expiresIn) {
    return {
      token: this.jwtService.sign(
        {},
        {
          subject: user.id.toString(),
          jwtid: v4(),
          expiresIn,
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

  signUrl(url: string, expiresInMs: number): string {
    const urlObj = new URL(url);

    urlObj.searchParams.set('expiresAt', (new Date().getTime() + expiresInMs).toString(10));

    const signature = this.createUrlSignature(urlObj);

    urlObj.searchParams.set('signature', signature);

    return urlObj.toString();
  }

  verifySignedUrl(url: string): boolean {
    const urlObj = new URL(url);

    if (Number.parseInt(urlObj.searchParams.get('expiresAt') || '', 10) < new Date().getTime()) {
      throw new Error(AppError.UrlExpired);
    }

    const urlSignature = urlObj.searchParams.get('signature');
    urlObj.searchParams.delete('signature');

    const currentUrlSignature = this.createUrlSignature(urlObj);

    if (currentUrlSignature !== urlSignature) {
      throw new HttpException(
        AppError.InvalidSignature,
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }

  private createUrlSignature(urlObj: URL): string {
    return crypto
      .createHmac('SHA256', this.configService.get('APP_CRYPTO_SECRET'))
      .update(urlObj.toString())
      .digest('base64');
  }
}
