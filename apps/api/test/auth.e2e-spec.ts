import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    let accessToken = '';
    let refreshToken = '';

    it('/auth/request-otp (POST) - Success', async () => {
        return request(app.getHttpServer())
            .post('/auth/request-otp')
            .send({ phone: '+919999999999' })
            .expect(200)
            .expect((res: any) => {
                expect(res.body.message).toBeDefined();
            });
    });

    it('/auth/verify-otp (POST) - Success', async () => {
        return request(app.getHttpServer())
            .post('/auth/verify-otp')
            .send({ phone: '+919999999999', otp: '123456' })
            .expect(200)
            .expect((res: any) => {
                expect(res.body.access_token).toBeDefined();
                expect(res.body.refresh_token).toBeDefined();
                accessToken = res.body.access_token;
                refreshToken = res.body.refresh_token;
            });
    });

    it('/auth/verify-otp (POST) - Fail (Invalid Payload)', async () => {
        return request(app.getHttpServer())
            .post('/auth/verify-otp')
            .send({ phone: '+919999999999' }) // Missing OTP
            .expect(400); // Bad Request from Validator
    });

    it('/auth/refresh (POST) - Success', async () => {
        return request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refresh_token: refreshToken })
            .expect(200)
            .expect((res: any) => {
                expect(res.body.access_token).toBeDefined();
                // optionally issue new refresh token
            });
    });

    it('/auth/sessions (GET) - Unauthorized without token', async () => {
        return request(app.getHttpServer())
            .get('/auth/sessions')
            .expect(401);
    });

    it('/auth/sessions (GET) - Success with token', async () => {
        return request(app.getHttpServer())
            .get('/auth/sessions')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .expect((res: any) => {
                expect(Array.isArray(res.body)).toBe(true);
            });
    });

    it('/auth/logout (POST) - Success with token', async () => {
        return request(app.getHttpServer())
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .expect((res: any) => {
                expect(res.body.success).toBe(true);
            });
    });

});

