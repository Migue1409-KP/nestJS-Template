import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;
    const userAgent = request.get('User-Agent') || '';
    const requestId = request.requestId || 'no-request-id';

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const contentLength = response.get('Content-Length') || 0;
        const delay = Date.now() - now;

        this.logger.log(
          `[${requestId}] ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} +${delay}ms`,
        );
      }),
    );
  }
}
