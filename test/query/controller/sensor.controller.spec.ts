import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { RetrieveSensorQuery } from '../../../src/query/model/sensor.query';
import { SensorIdParams } from '../../../src/query/controller/model/id-params';
import { SensorController } from '../../../src/query/controller/sensor.controller';
import { RetrieveSensorsParams } from '../../../src/query/controller/model/retrieve-sensors-params';

const testSensors = [
    {
        _id: 'test-id',
        name: 'test-sensor',
    }, {
        _id: 'test-id-2',
        name: 'test-sensor-2',
    },
];

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
        it('should return an array of sensors', async () => {
            jest.spyOn(queryBus, 'execute').mockImplementation(async (query: RetrieveSensorQuery) => {
                return testSensors.filter((owner) => owner._id === query.id);
            });

            const req = {sensorId: 'test-id'} as SensorIdParams;
            expect(await sensorController.retrieveSensor(req)).toHaveLength(1);
        });

        it('should return an array of all sensors', async () => {
            jest.spyOn(queryBus, 'execute').mockImplementation(async () => testSensors);

            const req = {} as RetrieveSensorsParams;
            expect(await sensorController.retrieveSensors(req)).toHaveLength(2);
        });
    });
});
