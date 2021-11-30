import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventPayload } from './app.model';

@Injectable()
export class QueueService {
  constructor(
    @Inject(process.env.RMQ_QUEUE) private readonly queueClient: ClientProxy,
  ) {}

  publishEvent(event: string, args: EventPayload) {
    this.queueClient.emit<any>(event, args);
  }
}
