import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm/error/TypeORMError';

@Catch(TypeORMError)
export class TypeoremFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = HttpStatus.UNPROCESSABLE_ENTITY;
    const { message } = exception as TypeORMError;
    const { code } = exception as any;

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
