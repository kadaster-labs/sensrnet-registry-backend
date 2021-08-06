import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    // Without login credentials, we expect a status 401
    it(`/GET Sensor`, () => {
        return request(app.getHttpServer())
            .get('/Sensor')
            .expect(401);
    });

    // Without login credentials, we expect a status 401
    it(`/GET Owner`, () => {
        return request(app.getHttpServer())
            .get('/Owner')
            .expect(401);
    });

    afterAll(async () => {
        await app.close();
    });
});
