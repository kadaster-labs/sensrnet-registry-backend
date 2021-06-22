import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DomainExceptionFilter } from './core/errors/domain-exception.filter';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());
  app.setGlobalPrefix('api');

  const documentOptions = new DocumentBuilder()
    .setTitle('SensRNet Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('/api', app, document);

  await app.listen(port);
}

bootstrap().then();
