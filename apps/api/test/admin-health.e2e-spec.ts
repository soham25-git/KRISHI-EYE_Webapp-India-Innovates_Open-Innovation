import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Admin & Demo Routes (e2e)', () => {
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

    it('/demo/seed-job (POST) - Unauthorized (No Token)', async () => {
        return request(app.getHttpServer())
            .post('/demo/seed-job')
            .expect(401);
    });

    it('/admin/knowledge-sources (GET) - Unauthorized (No Token)', async () => {
        return request(app.getHttpServer())
            .get('/admin/knowledge-sources')
            .expect(401);
    });

    it('/health (GET) - Success', async () => {
        return request(app.getHttpServer())
            .get('/health')
            .expect(200)
            .expect((res: any) => {
                expect(res.body.status).toBe('ok');
            });
    });

    it('/health/readiness (GET) - Success', async () => {
        return request(app.getHttpServer())
            .get('/health/readiness')
            .expect(200)
            .expect((res: any) => {
                expect(res.body.status).toBe('ready');
            });
    });
});

