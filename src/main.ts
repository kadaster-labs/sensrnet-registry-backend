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
    }), // where session will be stored
    secret: process.env.SESSION_SECRET, // to sign session id
    resave: false, // will default to false in near future: https://github.com/expressjs/session#resave
    saveUninitialized: false, // will default to false in near future: https://github.com/expressjs/session#saveuninitialized
    rolling: true, // keep session alive
    cookie: {
      maxAge: 30 * 60 * 1000, // session expires in 1hr, refreshed by `rolling: true` option.
      httpOnly: true, // so that cookie can't be accessed via client-side script
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
