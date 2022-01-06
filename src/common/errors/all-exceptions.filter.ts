import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = response.message
      || response.message?.[0]
      || exception.response?.message?.[0]
      || exception.message
      || exception.message?.error
      || exception.response?.statusCode
      || '';
    const code = exception?.code
      || HttpStatus[status || exception?.response?.statusCode]
      || '';

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
