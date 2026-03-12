import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Jobs Module (e2e)', () => {
    let app: INestApplication;
    let ownerToken = '';
    let otherToken = '';
    let farmId = '';
    let secondFarmId = '';
    let tractorId = '';
    let fieldId = '';
    let secondFarmTractorId = '';
    let jobId = '';

    jest.setTimeout(60000);

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 1. Get tokens
        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+917777777771' });
        const res1 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+917777777771', otp: '123456' });
        ownerToken = res1.body.access_token;

        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+917777777772' });
        const res2 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+917777777772', otp: '123456' });
        otherToken = res2.body.access_token;

        // 2. Create Farm 1 with Tractor and Field
        const farmRes = await request(app.getHttpServer())
            .post('/farms')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ name: 'Job Farm 1', district: 'Pune', state: 'Maharashtra' });
        farmId = farmRes.body.id;

        const tractorRes = await request(app.getHttpServer())
            .post('/tractors')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ farm_id: farmId, label: 'Tractor 1' });
        tractorId = tractorRes.body.id;

        const fieldRes = await request(app.getHttpServer())
            .post('/fields')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ farm_id: farmId, name: 'Field 1' });
        fieldId = fieldRes.body.id;

        // 3. Create Farm 2 with its own Tractor
        const farm2Res = await request(app.getHttpServer())
            .post('/farms')
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ name: 'Job Farm 2', district: 'Pune', state: 'Maharashtra' });
        secondFarmId = farm2Res.body.id;

        const tractor2Res = await request(app.getHttpServer())
            .post('/tractors')
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ farm_id: secondFarmId, label: 'Tractor 2' });
        secondFarmTractorId = tractor2Res.body.id;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/jobs (POST) - Create Job', async () => {
        const res = await request(app.getHttpServer())
            .post('/jobs')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                tractor_id: tractorId,
                field_id: fieldId,
                status: 'pending'
            })
            .expect(201);

        jobId = res.body.id;
        expect(jobId).toBeDefined();
        expect(res.body.status).toBe('pending');
    });

    it('/jobs (POST) - Cross-Farm Integrity Error', async () => {
        // Attempting to use a tractor from Farm 2 for a job in Farm 1 context
        await request(app.getHttpServer())
            .post('/jobs')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                tractor_id: secondFarmTractorId,
                field_id: fieldId,
                status: 'pending'
            })
            .expect(400); // Bad Request (Tractor and Field must belong to the same farm)
    });

    it('/jobs (GET) - List Jobs', async () => {
        const res = await request(app.getHttpServer())
            .get('/jobs')
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((j: any) => j.id === jobId)).toBe(true);
    });

    it('/jobs/:id (PATCH) - Start Job (Status Transition)', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/jobs/${jobId}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ status: 'running' })
            .expect(200);

        expect(res.body.status).toBe('running');
        expect(res.body.started_at).toBeDefined();
    });

    it('/jobs/:id (PATCH) - Forbidden for other user', async () => {
        await request(app.getHttpServer())
            .patch(`/jobs/${jobId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ status: 'completed' })
            .expect(403);
    });

    it('/jobs/:id (PATCH) - Invalid Transition (Completed to Running)', async () => {
        // First complete it
        await request(app.getHttpServer())
            .patch(`/jobs/${jobId}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ status: 'completed' })
            .expect(200);

        // Then try to restart
        await request(app.getHttpServer())
            .patch(`/jobs/${jobId}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ status: 'running' })
            .expect(400);
    });
});
