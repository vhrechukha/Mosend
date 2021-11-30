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

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      status: status || exception.response.statusCode,
      code:
        exception.code ||
        HttpStatus[status || exception.response?.statusCode] ||
        '',
      message: response.message || response.message?.[0] || exception.message || exception.message?.error  || '',
    });
  }
}
