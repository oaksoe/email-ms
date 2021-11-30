import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './mail.service';
import { SendGridMailService } from './sendGridMail.service';
import { QueueService } from './queue.service';

const mailServiceProvider = {
  provide: MailService,
  useClass:
    process.env.MAIL_SERVICE_EXTERNAL === 'SendGrid'
      ? SendGridMailService
      : MailService,
};

@Module({
  imports: [
    ClientsModule.register([
      {
          name: process.env.RMQ_QUEUE,
          transport: Transport.RMQ,
          options: {
              urls: [process.env.RMQ_URL],
              queue: process.env.RMQ_QUEUE,
              queueOptions: {
                  durable: false,
              },
          },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    mailServiceProvider,
    QueueService,
  ],
})
export class AppModule {}
