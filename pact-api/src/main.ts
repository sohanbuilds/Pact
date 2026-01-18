import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const cookieParser = require('cookie-parser'); //For JWT gaurd in protected routes

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('PACT API')
    .setDescription('API documentation for PACT task system')
    .setVersion('1.0')
    .addCookieAuth('token') // IMPORTANT for JWT in cookies
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
