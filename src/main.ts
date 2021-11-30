import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(
    process.cwd(), 
    'config', 
    `${process.env.NODE_ENV || 'default'}.env`),
});

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
        urls: [process.env.RMQ_URL],
        queue: process.env.RMQ_QUEUE,
        queueOptions: {
          durable: false,
        },
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
