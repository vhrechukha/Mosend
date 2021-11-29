import { Injectable } from '@nestjs/common';
import {AppConfigService} from './config/app.config.service';

@Injectable()
export class AppService {
  constructor(
      private appConfigService: AppConfigService
  ) {
  }
  getHello(): string {
    return 'Hello World!';
  }

  getPort(): string {
    return this.appConfigService.get('APP_PORT');
  }
}
