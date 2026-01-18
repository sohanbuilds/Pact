import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser'); //For JWT gaurd in protected routes

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
