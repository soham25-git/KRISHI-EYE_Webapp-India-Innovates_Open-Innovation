import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Tractors Module (e2e)', () => {
    let app: INestApplication;
    let ownerToken = '';
    let otherToken = '';
    let farmId = '';
    let tractorId = '';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 1. Get token for Owner
        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+918888888881' });
        const res1 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+918888888881', otp: '123456' });
        ownerToken = res1.body.access_token;

        // 2. Get token for Other User
        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+918888888882' });
        const res2 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+918888888882', otp: '123456' });
        otherToken = res2.body.access_token;

        // 3. Create a farm
        const farmRes = await request(app.getHttpServer())
            .post('/farms')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ name: 'Tractor Farm', district: 'Pune', state: 'Maharashtra' });
        farmId = farmRes.body.id;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/tractors (POST) - Register Tractor', async () => {
        const res = await request(app.getHttpServer())
            .post('/tractors')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                farm_id: farmId,
                label: 'Mahindra Arjun 605',
                description: 'Heavy duty ploughing',
                color_hex: '#ff0000'
            })
            .expect(201);

        tractorId = res.body.id;
        expect(tractorId).toBeDefined();
    });

    it('/tractors (POST) - Forbidden for non-owner', async () => {
        await request(app.getHttpServer())
            .post('/tractors')
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ farm_id: farmId, label: 'Rogue Tractor' })
            .expect(403);
    });

    it('/tractors (GET) - List Tractors', async () => {
        const res = await request(app.getHttpServer())
            .get('/tractors')
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((t: any) => t.id === tractorId)).toBe(true);
    });

    it('/tractors/:id (GET) - Get Tractor Detail', async () => {
        await request(app.getHttpServer())
            .get(`/tractors/${tractorId}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);
    });

    it('/tractors/:id (GET) - Forbidden for other user', async () => {
        await request(app.getHttpServer())
            .get(`/tractors/${tractorId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .expect(403);
    });

    it('/tractors/:id (PATCH) - Update Tractor', async () => {
        await request(app.getHttpServer())
            .patch(`/tractors/${tractorId}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ label: 'Updated Tractor Label' })
            .expect(200);
    });
});
