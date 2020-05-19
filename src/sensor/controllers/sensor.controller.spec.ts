import { Test, TestingModule } from '@nestjs/testing';
import { SensorController } from './sensor.controller';
import { SensorService } from '../services/sensor.service';


describe('Sensor Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SensorController],
      providers: [SensorService],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SensorController = module.get<SensorController>(SensorController);
    expect(controller).toBeDefined();
  });
});
