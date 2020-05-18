import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { SensorsService } from '../services/sensors.service';

describe('Sensors Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [SensorsService],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SensorsController = module.get<SensorsController>(SensorsController);
    expect(controller).toBeDefined();
  });
});
