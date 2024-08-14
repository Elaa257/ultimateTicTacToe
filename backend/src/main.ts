import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastifyCookie from '@fastify/cookie';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
    email: string;
    password: string;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(fastifyCookie, {
    secret: 'my-secret', // for signed cookies
  });

  /*
  app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }));
  */
  app.setGlobalPrefix('backend');

  const config = new DocumentBuilder()
    .setTitle('Ultimate TicTacToe')
    .setDescription('The ultimate TicTacToe API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:4200', // URL des Angular-Entwicklungsservers
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
