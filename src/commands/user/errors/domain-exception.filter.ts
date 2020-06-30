import { Response } from 'express';
import { DomainException } from './domain-exception';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      error: exception.message,
    });
  }
}
