import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Ownership Guard (e2e)', () => {
    let app: INestApplication;
    let farmerToken = '';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 1. Request OTP
        await request(app.getHttpServer())
            .post('/auth/request-otp')
            .send({ phone: '+919999999999' });

        // 2. Verify OTP
        const res = await request(app.getHttpServer())
            .post('/auth/verify-otp')
            .send({ phone: '+919999999999', otp: '123456' });

        farmerToken = res.body.access_token;
        if (!farmerToken) {
            throw new Error('Failed to get access token for ownership tests: ' + JSON.stringify(res.body));
        }
    });

    afterAll(async () => {
        await app.close();
    });

    it('/farms/:farmId (GET) - Ownership check 403', async () => {
        const rogueFarmId = '00000000-0000-0000-0000-000000000000';
        return request(app.getHttpServer())
            .get(`/farms/${rogueFarmId}`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .expect(403);
    });

    it('/fields/:fieldId (PATCH) - Ownership check 403', async () => {
        const rogueFieldId = '00000000-0000-0000-0000-000000000000';
        return request(app.getHttpServer())
            .patch(`/fields/${rogueFieldId}`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .send({ name: 'New Name' })
            .expect(403);
    });

});
