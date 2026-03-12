import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Telemetry Module (e2e)', () => {
    let app: INestApplication;
    let ownerToken = '';
    let otherToken = '';
    let farmId = '';
    let tractorId = '';
    let jobId = '';

    jest.setTimeout(60000);

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 1. Setup users
        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+916666666661' });
        const res1 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+916666666661', otp: '123456' });
        ownerToken = res1.body.access_token;

        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+916666666662' });
        const res2 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+916666666662', otp: '123456' });
        otherToken = res2.body.access_token;

        // 2. Setup farm, tractor, field, job
        const farmRes = await request(app.getHttpServer())
            .post('/farms')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ name: 'Telemetry Farm', district: 'Pune', state: 'Maharashtra' });
        farmId = farmRes.body.id;

        const tractorRes = await request(app.getHttpServer())
            .post('/tractors')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ farm_id: farmId, label: 'Kubota A211N' });
        tractorId = tractorRes.body.id;

        const fieldRes = await request(app.getHttpServer())
            .post('/fields')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ farm_id: farmId, name: 'South Orchard' });
        const fieldId = fieldRes.body.id;

        const jobRes = await request(app.getHttpServer())
            .post('/jobs')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ tractor_id: tractorId, field_id: fieldId, status: 'running' });
        jobId = jobRes.body.id;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/telemetry/batch (POST) - Ingest Batch', async () => {
        await request(app.getHttpServer())
            .post('/telemetry/batch')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                tractorId,
                jobId,
                points: [
                    { recordedAt: new Date().toISOString(), location: 'POINT(73.8567 18.5204)', speedKmph: 12.5 },
                    { recordedAt: new Date().toISOString(), location: 'POINT(73.8568 18.5205)', speedKmph: 13.0 }
                ]
            })
            .expect(201);
    });

    it('/telemetry/batch (POST) - Forbidden for other user', async () => {
        await request(app.getHttpServer())
            .post('/telemetry/batch')
            .set('Authorization', `Bearer ${otherToken}`)
            .send({
                tractorId,
                jobId,
                points: [{ recordedAt: new Date().toISOString(), location: 'POINT(...)' }]
            })
            .expect(403);
    });

    it('/telemetry/batch (POST) - Error for completed job', async () => {
        // Complete the job
        await request(app.getHttpServer())
            .patch(`/jobs/${jobId}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ status: 'completed' });

        // Try to ingest
        await request(app.getHttpServer())
            .post('/telemetry/batch')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                tractorId,
                jobId,
                points: [{ recordedAt: new Date().toISOString(), location: 'POINT(...)' }]
            })
            .expect(400);
    });
});
