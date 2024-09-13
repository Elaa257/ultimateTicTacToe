import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastifyCookie from '@fastify/cookie';
import { NoCacheInterceptor } from './common/no-cache.interceptor';

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
    new FastifyAdapter()
  );
  await app.register(fastifyCookie, {
    secret: 'my-secret', // for signed cookies
  });

  app.setGlobalPrefix('backend');

  const config = new DocumentBuilder()
    .setTitle('Ultimate TicTacToe')
    .setDescription('The ultimate TicTacToe API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new NoCacheInterceptor());

  await app.listen(3000);
}
bootstrap();
