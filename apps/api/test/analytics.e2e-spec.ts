import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Analytics Module (e2e)', () => {
    let app: INestApplication;
    let ownerToken = '';
    let otherToken = '';
    let farmId = '';
    let jobId = '';

    jest.setTimeout(60000);

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 1. Setup users
        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+915555555551' });
        const res1 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+915555555551', otp: '123456' });
        ownerToken = res1.body.access_token;

        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+915555555552' });
        const res2 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+915555555552', otp: '123456' });
        otherToken = res2.body.access_token;

        // 2. Setup farm and job
        const farmRes = await request(app.getHttpServer())
            .post('/farms')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ name: 'Analytics Farm', district: 'Pune', state: 'Maharashtra' });
        farmId = farmRes.body.id;

        const tractorRes = await request(app.getHttpServer())
            .post('/tractors')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ farm_id: farmId, label: 'Drone T30' });
        const tractorId = tractorRes.body.id;

        const fieldRes = await request(app.getHttpServer())
            .post('/fields')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ farm_id: farmId, name: 'North Vineyard' });
        const fieldId = fieldRes.body.id;

        const jobRes = await request(app.getHttpServer())
            .post('/jobs')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ tractor_id: tractorId, field_id: fieldId, status: 'running' });
        jobId = jobRes.body.id;

        // 3. Ingest some telemetry to affect analytics
        await request(app.getHttpServer())
            .post('/telemetry/batch')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                tractorId,
                jobId,
                points: [{ recordedAt: new Date().toISOString(), location: 'POINT(0 0)', speedKmph: 20 }]
            });
    });

    afterAll(async () => {
        await app.close();
    });

    it('/analytics/overview (GET)', async () => {
        const res = await request(app.getHttpServer())
            .get('/analytics/overview')
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);

        expect(res.body.totalFarms).toBeGreaterThan(0);
        expect(res.body.activeJobs).toBeDefined();
    });

    it('/analytics/farms/:farmId/improvement (GET)', async () => {
        await request(app.getHttpServer())
            .get(`/analytics/farms/${farmId}/improvement`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);
    });

    it('/analytics/jobs/:jobId/summary (GET)', async () => {
        const res = await request(app.getHttpServer())
            .get(`/analytics/jobs/${jobId}/summary`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);

        expect(res.body.jobId).toBe(jobId);
    });

    it('/analytics/farms/:farmId/improvement (GET) - Forbidden for other user', async () => {
        await request(app.getHttpServer())
            .get(`/analytics/farms/${farmId}/improvement`)
            .set('Authorization', `Bearer ${otherToken}`)
            .expect(403);
    });
});
