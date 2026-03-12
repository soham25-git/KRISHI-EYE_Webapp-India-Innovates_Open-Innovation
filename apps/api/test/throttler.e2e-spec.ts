import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Throttler & Rate Limits (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('Should throw 429 after limit is reached on /auth/request-otp', async () => {
        // The Throttler on auth/request-otp is 3 req/min.

        // We send 3 valid requests
        for (let i = 0; i < 3; i++) {
            await request(app.getHttpServer())
                .post('/auth/request-otp')
                .send({ phone: '+919999999999' })
                .expect((res: any) => {
                    // It could respond with 200 or 400 depending on payloads, but we care that it's NOT 429
                    expect(res.status).not.toBe(429);
                });
        }

        // 4th request MUST be 429
        await request(app.getHttpServer())
            .post('/auth/request-otp')
            .send({ phone: '+919999999999' })
            .expect(429);
    });
});

