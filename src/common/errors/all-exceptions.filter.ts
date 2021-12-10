import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let message: string;
    let code: number;
    let status: HttpStatus;

    switch (exception.constructor) {
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as EntityNotFoundError).message;
        code = (exception as any).code;
        break;
      default:
        status = exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
        message = response.message
          || response.message?.[0]
          || exception.response?.message?.[0]
          || exception.message
          || exception.message?.error
          || exception.response?.statusCode
          || '';
        code = exception?.code
          || HttpStatus[status || exception?.response?.statusCode]
          || '';
    }

    response.status(status).json({
      status,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
