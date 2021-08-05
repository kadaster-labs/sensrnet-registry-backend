import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { DeviceController } from './device-controller';
import { DeviceIdParams } from './model/device-id-params';
import { RetrieveDeviceQuery } from '../model/device.query';
import { RetrieveDevicesParams } from './model/retrieve-devices-params';

const testDevices = [
    {_id: 'test-id', name: 'test-device'},
    {_id: 'test-id-2', name: 'test-device-2'},
];

describe('SensorController', () => {
    let queryBus: QueryBus;
    let sensorController: DeviceController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [
                DeviceController,
            ], providers: [
                QueryBus,
            ],
        }).compile();

        queryBus = moduleRef.get<QueryBus>(QueryBus);
        sensorController = moduleRef.get<DeviceController>(DeviceController);
    });

    describe('retrieveSensor', () => {
        it('should return an array of sensors', async () => {
            jest.spyOn(queryBus, 'execute').mockImplementation(async (query: RetrieveDeviceQuery) => {
                return testDevices.filter((sensor) => sensor._id === query.id);
            });

            const req = {deviceId: 'test-id'} as DeviceIdParams;
            expect(await sensorController.retrieveDevice(req)).toHaveLength(1);
        });

        it('should return an array of all sensors', async () => {
            jest.spyOn(queryBus, 'execute').mockImplementation(async () => testDevices);

            const req = {} as RetrieveDevicesParams;
            expect(await sensorController.retrieveDevices({} as any, req)).toHaveLength(2);
        });
    });
});
