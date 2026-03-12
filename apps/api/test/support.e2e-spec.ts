import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Support Module (e2e)', () => {
    let app: INestApplication;
    let ownerToken = '';
    let otherToken = '';
    let farmId = '';
    let fieldId = '';
    let ticketId = '';

    jest.setTimeout(60000);

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 1. Setup users
        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+914444444441' });
        const res1 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+914444444441', otp: '123456' });
        ownerToken = res1.body.access_token;

        await request(app.getHttpServer()).post('/auth/request-otp').send({ phone: '+914444444442' });
        const res2 = await request(app.getHttpServer()).post('/auth/verify-otp').send({ phone: '+914444444442', otp: '123456' });
        otherToken = res2.body.access_token;

        // 2. Setup farm and field
        const farmRes = await request(app.getHttpServer())
            .post('/farms')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ name: 'Support Farm', district: 'Pune', state: 'Maharashtra' });
        farmId = farmRes.body.id;

        const fieldRes = await request(app.getHttpServer())
            .post('/fields')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ farm_id: farmId, name: 'Support Field' });
        fieldId = fieldRes.body.id;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/support/tickets (POST) - Create Global Ticket', async () => {
        const res = await request(app.getHttpServer())
            .post('/support/tickets')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                title: 'Need help with app',
                category: 'technical',
                description: 'Cannot login'
            })
            .expect(201);
        ticketId = res.body.id;
    });

    it('/support/tickets (POST) - Create Farm Ticket', async () => {
        await request(app.getHttpServer())
            .post('/support/tickets')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                title: 'Pest issue',
                category: 'agronomy',
                farmId,
                fieldId,
                description: 'Locust swarm detected'
            })
            .expect(201);
    });

    it('/support/tickets (POST) - Forbidden for non-member farm ticket', async () => {
        await request(app.getHttpServer())
            .post('/support/tickets')
            .set('Authorization', `Bearer ${otherToken}`)
            .send({
                title: 'Stolen data',
                category: 'security',
                farmId,
                description: 'Unauthorized access'
            })
            .expect(403);
    });

    it('/support/tickets (GET) - List Tickets', async () => {
        const res = await request(app.getHttpServer())
            .get('/support/tickets')
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('/support/tickets/:id (GET) - Member can view farm ticket', async () => {
        // First get the ticket created for the farm
        const listRes = await request(app.getHttpServer())
            .get('/support/tickets')
            .set('Authorization', `Bearer ${ownerToken}`);
        const farmTicket = listRes.body.find((t: any) => t.farm_id === farmId);

        await request(app.getHttpServer())
            .get(`/support/tickets/${farmTicket.id}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);
    });

    it('/support/tickets/:id (PATCH) - Update Status (Resolve)', async () => {
        await request(app.getHttpServer())
            .patch(`/support/tickets/${ticketId}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ status: 'resolved', resolutionSummary: 'Issue fixed by update' })
            .expect(200);
    });

    it('/support/contacts (GET) - List Contacts', async () => {
        await request(app.getHttpServer())
            .get('/support/contacts')
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);
    });

    it('/support/knowledge (GET) - List Knowledge', async () => {
        await request(app.getHttpServer())
            .get('/support/knowledge')
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(200);
    });
});
