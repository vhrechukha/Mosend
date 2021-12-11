import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async send({
    to, subject, html,
  }): Promise<any> {
    return sgMail
      .send({
        to,
        subject,
        html,
        from: this.configService.get('SENDGRID_EMAIL'),
      });
  }
}
