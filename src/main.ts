import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  mongoose.set({ debug: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();
