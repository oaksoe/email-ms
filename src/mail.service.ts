import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Message } from './app.model';

@Injectable()
export class MailService {
  async send(message: Message): Promise<void> {
    throw new HttpException(
      `External Mail delivery service is not configured.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
