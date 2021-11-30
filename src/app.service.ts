import { Injectable } from '@nestjs/common';
import { EventPayload, MailPayload, Message } from './app.model';
import { MailService } from './mail.service';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailService) {}

  getStatus(): string {
    return `Email service is running in ${process.env.NODE_ENV || 'local'} environment.`;
  }

  async sendMail(mailPayload: MailPayload): Promise<boolean> {
    const { to, subject, content } = mailPayload;

    await this.mailService.send({
      to,
      from: process.env.MAIL_SENDER,
      subject,
      text: content,
      html: '',
    });

    return true;
  }

  async sendEventMail(eventPayload: EventPayload): Promise<void> {
    await this.mailService.send(this.enrichMailData(eventPayload));
  }

  enrichMailData(eventPayload: EventPayload): Message {
    const { users, subject, content } = eventPayload;

    // if needed, call other microservice apis to enrich data required for email address and content

    return {
      to: users.map(user => `${user.username}@gmail.com`).join(','),
      from: process.env.MAIL_SENDER,
      subject,
      text: content,
      html: '',
    }
  }
}
