import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as session from 'express-session';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastifyCookie from '@fastify/cookie';


declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
    email:string;
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

  app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }));
  app.setGlobalPrefix('api'); // Hier wird der globale Präfix gesetzt



  const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('cats')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
