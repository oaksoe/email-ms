import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { MailPayload, EventPayload } from './app.model';
import { QueueService } from './queue.service';
import { QueueEvents } from './constants';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly queueService: QueueService,
  ) {}

  @Get()
  getServiceStatus(): string {
    return this.appService.getStatus();
  }

  @Post('mail')
  sendMail(@Body() payload: MailPayload): Promise<boolean> {
    return this.appService.sendMail(payload);
  }

  @Post('testEvent')
  testEvent(@Body() payload: EventPayload): string {
    this.queueService.publishEvent(QueueEvents.EVENT_OCURRED, payload);
    return 'Test event is published.';
  }

  @EventPattern(QueueEvents.EVENT_OCURRED)
  async handleEvent(payload: EventPayload): Promise<void> {
    console.log('Event received with payload', payload);
    await this.appService.sendEventMail(payload);
  }
}
