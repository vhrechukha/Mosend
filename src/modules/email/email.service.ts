import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async send({
    to, subject, html,
  }): Promise<[ClientResponse, unknown]> {
    return sgMail
      .send({
        to,
        subject,
        html,
        from: this.configService.get('SENDGRID_EMAIL'),
      });
  }
}
