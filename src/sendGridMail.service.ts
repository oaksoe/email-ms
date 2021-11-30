import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { Message } from './app.model';
import { MailService } from './mail.service';

@Injectable()
export class SendGridMailService extends MailService {
  constructor() {
    super();
    sgMail.setApiKey(process.env.SG_API_KEY);
  }

  async send(message: Message): Promise<void> {
    try {
      await sgMail.send(message);
    } catch(err) {
      if (err instanceof HttpException) {
        throw err;
      }
      
      throw new HttpException(
        `Exception occurred while sending mail using SendGrid: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
