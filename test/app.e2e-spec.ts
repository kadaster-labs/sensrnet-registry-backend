import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('Owners (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
  });

  xit(`/GET Owner`, () => {
    return request(app.getHttpServer())
        .get('Owner')
        .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
