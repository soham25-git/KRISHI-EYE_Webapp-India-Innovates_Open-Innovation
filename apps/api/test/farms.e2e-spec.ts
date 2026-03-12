import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Farms Module (e2e)', () => {
    let app: INestApplication;
    let farmerToken = '';
    let otherToken = '';
    let farmId = '';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 1. Get token for Farmer 1
        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+919999999991' });
        const res1 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+919999999991', otp: '123456' });
        farmerToken = res1.body.access_token;

        // 2. Get token for Farmer 2 (Other)
        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+919999999992' });
        const res2 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+919999999992', otp: '123456' });
        otherToken = res2.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/farms (POST) - Create Farm', async () => {
        const res = await request(app.getHttpServer())
            .post('/farms')
            .set('Authorization', `Bearer ${farmerToken}`)
            .send({
                name: 'Green Acres',
                district: 'Solapur',
                state: 'Maharashtra',
                centroid_wkt: 'POINT(75.9 17.6)'
            })
            .expect(201);

        farmId = res.body.id;
        expect(farmId).toBeDefined();
        expect(res.body.name).toBe('Green Acres');
    });

    it('/farms (GET) - List Farms', async () => {
        const res = await request(app.getHttpServer())
            .get('/farms')
            .set('Authorization', `Bearer ${farmerToken}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((f: any) => f.id === farmId)).toBe(true);
    });

    it('/farms/:id (GET) - Get Farm Detail', async () => {
        await request(app.getHttpServer())
            .get(`/farms/${farmId}`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .expect(200);
    });

    it('/farms/:id (GET) - Get Farm Detail (Forbidden for other)', async () => {
        await request(app.getHttpServer())
            .get(`/farms/${farmId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .expect(403);
    });

    it('/farms/:id (PATCH) - Update Farm', async () => {
        await request(app.getHttpServer())
            .patch(`/farms/${farmId}`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .send({ name: 'Updated Green Acres' })
            .expect(200);
    });

    it('/farms/:id (PATCH) - Update Farm (Forbidden for other)', async () => {
        await request(app.getHttpServer())
            .patch(`/farms/${farmId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ name: 'Rogue Update' })
            .expect(403);
    });

    it('/farms/:id/members (POST) - Add Member', async () => {
        // We need a userId for other. In mock auth, we can't easily get it without another GET /me
        const meRes = await request(app.getHttpServer())
            .get('/me')
            .set('Authorization', `Bearer ${otherToken}`)
            .expect(200);
        const otherUserId = meRes.body.id;

        await request(app.getHttpServer())
            .post(`/farms/${farmId}/members`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .send({ targetUserId: otherUserId, role: 'farm_member' })
            .expect(201);

        // Now other user should have read access
        await request(app.getHttpServer())
            .get(`/farms/${farmId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .expect(200);
    });

    it('/farms/:id/fields (GET) - List Fields in Farm', async () => {
        await request(app.getHttpServer())
            .get(`/farms/${farmId}/fields`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .expect(200);
    });
});
