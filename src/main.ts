import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
// import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DomainExceptionFilter } from './core/errors/domain-exception.filter';
import * as session from 'express-session';
import * as passport from 'passport';
import MongoStore from 'connect-mongo';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());
  app.setGlobalPrefix('api');

  // Authentication & Session
  app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      dbName: process.env.MONGO_DATABASE,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  const documentOptions = new DocumentBuilder()
    .setTitle('Sensrnet Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('/api', app, document);

  await app.listen(port);
}

bootstrap();
