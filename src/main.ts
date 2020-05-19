import { config } from '../config';
import fastifyCors from 'fastify-cors';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter({
    trustProxy: true,
    logger: true,
  }));
  const documentOptions = new DocumentBuilder()
    .setTitle(config.TITLE)
    .setDescription(config.DESCRIPTION)
    .setVersion(config.VERSION)
    .setBasePath(`/${config.PREFIX}`)
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  const validationOptions = {
    skipMissingProperties: true,
    validationError: { target: false },
  };
  /*--------------------------------------------*/
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.setGlobalPrefix(config.PREFIX);
  app.register(fastifyCors, {
    origin: true,
  });
  SwaggerModule.setup(config.API_EXPLORER_PATH, app, document);
  await app.listen(config.PORT, config.HOST);
  Logger.log(`Server listening on port ${config.PORT}`, 'Bootstrap');
}

bootstrap();
