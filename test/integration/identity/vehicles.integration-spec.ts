import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { newClientCreateBody } from '../mocks/client.mock';
import {
  newVehicleCreateBody,
  VALID_PLATE_VEHICLES,
} from '../mocks/vehicle.mock';
import {
  bootstrapIntegrationApp,
  loginAsIntegrationAdmin,
  shutdownIntegrationApp,
} from '../helpers/integration-app';

describe('Vehicles (integration)', () => {
  let app: INestApplication;
  let clientId: string;

  beforeAll(async () => {
    app = await bootstrapIntegrationApp();
    const token = await loginAsIntegrationAdmin(app);
    const clientRes = await request(app.getHttpServer())
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(
        newClientCreateBody({
          document: '80852191405',
          email: 'vehicle-owner@test.dev',
          name: 'Dono do veículo (integration)',
        }),
      );
    expect([200, 201]).toContain(clientRes.status);
    clientId = clientRes.body.id as string;
  }, 120_000);

  afterAll(async () => {
    await shutdownIntegrationApp(app);
  });

  it('POST /vehicle sem JWT — 401', async () => {
    const res = await request(app.getHttpServer())
      .post('/vehicle')
      .send(newVehicleCreateBody({ clientId }));
    expect(res.status).toBe(401);
  });

  it('POST /vehicle com JWT — cria veículo ligado ao cliente', async () => {
    const token = await loginAsIntegrationAdmin(app);
    const body = newVehicleCreateBody({ clientId });
    const res = await request(app.getHttpServer())
      .post('/vehicle')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
    expect([200, 201]).toContain(res.status);
    expect(res.body.id).toBeDefined();
    expect(res.body.clientId).toBe(clientId);
    expect(String(res.body.plate).replace(/-/g, '').toUpperCase()).toBe(
      VALID_PLATE_VEHICLES,
    );
    expect(res.body.model).toBe(body.model);
    expect(res.body.brand).toBe(body.brand);
    expect(res.body.year).toBe(body.year);
  });

  it('POST /vehicle com clientId inexistente — 404', async () => {
    const token = await loginAsIntegrationAdmin(app);
    const res = await request(app.getHttpServer())
      .post('/vehicle')
      .set('Authorization', `Bearer ${token}`)
      .send(
        newVehicleCreateBody({
          clientId: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
          plate: 'XYZ1A23',
        }),
      );
    expect(res.status).toBe(404);
  });

  it('GET /vehicle — lista inclui veículo criado', async () => {
    const token = await loginAsIntegrationAdmin(app);
    const list = await request(app.getHttpServer())
      .get('/vehicle')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(
      list.body.some(
        (v: { plate: string; clientId: string }) =>
          String(v.plate).replace(/-/g, '').toUpperCase() ===
            VALID_PLATE_VEHICLES && v.clientId === clientId,
      ),
    ).toBe(true);
  });

  it('GET /vehicle/:plate — retorna veículo com clientId', async () => {
    const token = await loginAsIntegrationAdmin(app);
    const one = await request(app.getHttpServer())
      .get(`/vehicle/${VALID_PLATE_VEHICLES}`)
      .set('Authorization', `Bearer ${token}`);
    expect(one.status).toBe(200);
    expect(one.body.clientId).toBe(clientId);
    expect(String(one.body.plate).replace(/-/g, '').toUpperCase()).toBe(
      VALID_PLATE_VEHICLES,
    );
  });

  it('PATCH /vehicle/:plate — atualiza modelo', async () => {
    const token = await loginAsIntegrationAdmin(app);
    const res = await request(app.getHttpServer())
      .patch(`/vehicle/${VALID_PLATE_VEHICLES}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ model: 'Tracker', brand: 'Chevrolet', year: 2023 });
    expect([200, 201]).toContain(res.status);
    expect(res.body.model).toBe('Tracker');
    expect(res.body.year).toBe(2023);
    expect(res.body.clientId).toBe(clientId);
  });
});
