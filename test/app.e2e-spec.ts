import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ZodValidationPipe } from '../src/shared/pipes/zod-validation.pipe';
import { ProblemDetailsFilter } from '../src/shared/filters/problem-details.filter';
import { ResponseInterceptor } from '../src/shared/interceptors/response.interceptor';
import { RequestIdInterceptor } from '../src/shared/interceptors/request-id.interceptor';
import { Controller, Get, Module } from '@nestjs/common';
import { ApiSuccess } from '../src/shared/interfaces/api-response';

// ─── Stub module that avoids real DB/Auth dependencies ───────────────────────

@Controller('health')
class HealthController {
  @Get()
  check(): ApiSuccess<{ status: string }> {
    return { status: 'success', data: { status: 'ok' } };
  }
}

@Module({ controllers: [HealthController] })
class TestAppModule {}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalFilters(new ProblemDetailsFilter());
    app.useGlobalInterceptors(new RequestIdInterceptor(), new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 with success envelope', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toEqual('success');
          expect(res.body.data.status).toEqual('ok');
          expect(res.body).toHaveProperty('requestId');
        });
    });
  });

  describe('Unknown routes', () => {
    it('should return 404 with Problem Details format', () => {
      return request(app.getHttpServer())
        .get('/api/v1/non-existent-route')
        .expect(404)
        .expect((res) => {
          expect(res.body.status).toEqual('error');
          expect(res.body.error).toHaveProperty('status', 404);
          expect(res.body.error).toHaveProperty('type');
        });
    });
  });
});
