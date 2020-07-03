import { Response } from 'express';
import { UserException } from './user-exception';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch(UserException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: UserException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      error: exception.message,
    });
  }
}
