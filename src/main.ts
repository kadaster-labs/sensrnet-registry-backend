import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './commons/errors/domain-exception.filter';

async function bootstrap() {
    const port = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule, {
        logger:
            process.env.NODE_ENV === 'development'
                ? ['log', 'debug', 'error', 'verbose', 'warn']
                : ['error', 'warn', 'log'],
    });

    // WARNING the order matters because of the underlying platform !!
    app.use(helmet());
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
