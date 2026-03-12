import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Fields Module (e2e)', () => {
    let app: INestApplication;
    let farmerToken = '';
    let otherToken = '';
    let farmId = '';
    let fieldId = '';

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

        // 3. Create a farm to host fields
        const farmRes = await request(app.getHttpServer())
            .post('/farms')
            .set('Authorization', `Bearer ${farmerToken}`)
            .send({
                name: 'Field Test Farm',
                district: 'Solapur',
                state: 'Maharashtra'
            });
        farmId = farmRes.body.id;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/fields (POST) - Create Field', async () => {
        const res = await request(app.getHttpServer())
            .post('/fields')
            .set('Authorization', `Bearer ${farmerToken}`)
            .send({
                farm_id: farmId,
                name: 'North Plot',
                crop: 'Wheat',
                season: 'Kharif',
                area_acres: 10.5,
                boundary_wkt: 'POLYGON((...))'
            })
            .expect(201);

        fieldId = res.body.id;
        expect(fieldId).toBeDefined();
    });

    it('/fields/:id (GET) - Get Field Detail', async () => {
        await request(app.getHttpServer())
            .get(`/fields/${fieldId}`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .expect(200);
    });

    it('/fields/:id (GET) - Get Field Detail (Forbidden for other)', async () => {
        await request(app.getHttpServer())
            .get(`/fields/${fieldId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .expect(403);
    });

    it('/fields/:id (PATCH) - Update Field', async () => {
        await request(app.getHttpServer())
            .patch(`/fields/${fieldId}`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .send({ crop: 'Updated Wheat' })
            .expect(200);
    });

    it('/fields/:id/boundary (POST) - Update Boundary', async () => {
        await request(app.getHttpServer())
            .post(`/fields/${fieldId}/boundary`)
            .set('Authorization', `Bearer ${farmerToken}`)
            .send({ wkt: 'POLYGON((75 17, 76 17, 76 18, 75 18, 75 17))' })
            .expect(201);
    });

    it('/fields/:id/boundary (POST) - Forbidden for other', async () => {
        await request(app.getHttpServer())
            .post(`/fields/${fieldId}/boundary`)
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ wkt: 'POLYGON((...))' })
            .expect(403);
    });
});
