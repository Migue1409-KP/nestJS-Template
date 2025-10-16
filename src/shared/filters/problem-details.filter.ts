import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError, ProblemDetails } from '@/shared/interfaces/api-response';

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let problem: ProblemDetails;
    let status: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r = exception.getResponse();
      problem = {
        type: 'about:blank',
        title: HttpStatus[status] || 'Unknown Error',
        status,
        detail: typeof r === 'string' ? r : (r as any).message,
        instance: request.url,
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      problem = {
        type: 'about:blank',
        title: 'Internal Server Error',
        status,
        detail: (exception as any)?.message || 'Unexpected error',
        instance: request.url,
      };
    }

    const errorResponse: ApiError = {
      status: 'error',
      error: problem,
      requestId: request.headers['x-request-id'] as string,
    };

    response.status(status).json(errorResponse);
  }
}
