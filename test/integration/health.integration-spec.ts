import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  bootstrapIntegrationApp,
  shutdownIntegrationApp,
} from './helpers/integration-app';

describe('Health (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await bootstrapIntegrationApp();
  }, 120_000);

  afterAll(async () => {
    await shutdownIntegrationApp(app);
  });

  it('GET /health/live — retorna status ok carimbado com identity-service', async () => {
    const res = await request(app.getHttpServer()).get('/health/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('identity-service');
  });

  it('GET /health/ready — retorna status ok com PostgreSQL', async () => {
    const res = await request(app.getHttpServer()).get('/health/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('identity-service');
    expect(res.body.info.database.status).toBe('up');
  });
});
