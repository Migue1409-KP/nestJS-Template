import { ResponseInterceptor } from './response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

function buildContext(requestId = 'test-request-id'): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ requestId }),
    }),
  } as unknown as ExecutionContext;
}

function buildHandler(data: any): CallHandler {
  return { handle: () => of(data) };
}

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should wrap plain data in ApiSuccess envelope', (done) => {
    const ctx = buildContext('req-001');
    const handler = buildHandler({ id: 1, name: 'test' });

    interceptor.intercept(ctx, handler).subscribe((result) => {
      expect(result.status).toEqual('success');
      expect((result as any).data).toEqual({ id: 1, name: 'test' });
      expect((result as any).requestId).toEqual('req-001');
      done();
    });
  });

  it('should pass through responses that already have an ApiResponse envelope', (done) => {
    const ctx = buildContext('req-002');
    const alreadyWrapped = { status: 'success', data: 'already wrapped', requestId: 'req-002' };
    const handler = buildHandler(alreadyWrapped);

    interceptor.intercept(ctx, handler).subscribe((result) => {
      expect(result.status).toEqual('success');
      expect((result as any).requestId).toEqual('req-002');
      done();
    });
  });

  it('should fall back to "no-request-id" when requestId is not set in request', (done) => {
    const handler = buildHandler({ value: 42 });
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({}), // no requestId
      }),
    } as unknown as ExecutionContext;

    interceptor.intercept(ctx, handler).subscribe((result) => {
      expect((result as any).requestId).toEqual('no-request-id');
      done();
    });
  });
});
