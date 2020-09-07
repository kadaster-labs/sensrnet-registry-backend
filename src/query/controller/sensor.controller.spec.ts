import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { SensorIdParams } from './model/id-params';
import { SensorController } from './sensor.controller';
import { RetrieveSensorsParams } from './model/retrieve-sensors-params';

describe('SensorController', () => {
    let queryBus: QueryBus;
    let sensorController: SensorController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [
                SensorController,
            ],
            providers: [
                QueryBus,
            ],
        }).compile();

        queryBus = moduleRef.get<QueryBus>(QueryBus);
        sensorController = moduleRef.get<SensorController>(SensorController);
    });

    describe('retrieveSensor', () => {
        it('should return an array of sensors with a sensorId', async () => {
            const result = [{_id: '1', name: 'WeatherSensor'}];
            jest.spyOn(queryBus, 'execute').mockImplementation(async () => result);

            const req = {sensorId: '1'} as SensorIdParams;
            expect(await sensorController.retrieveSensor(req)).toBe(result);
        });

        it('should return an array of all sensors within a bounding box', async () => {
            const result = [{_id: '1', name: 'WeatherSensor'}];
            jest.spyOn(queryBus, 'execute').mockImplementation(async () => result);

            const req = {} as RetrieveSensorsParams;
            expect(await sensorController.retrieveSensors(req)).toBe(result);
        });
    });
});
