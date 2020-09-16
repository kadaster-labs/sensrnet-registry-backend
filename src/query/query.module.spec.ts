import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OwnerGateway } from './gateway/owner.gateway';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SensorGateway } from './gateway/sensor.gateway';
import { RetrieveSensorQuery } from './model/sensor.query';
import { RetrieveSensorsQuery } from './model/sensors.query';
import { OwnerProcessor } from './processor/owner.processor';
import { EventStoreModule } from '../event-store/event-store.module';
import { SensorProcessor } from './processor/sensor.processor';
import { OwnerController } from './controller/owner.controller';
import { SensorController } from './controller/sensor.controller';
import { RetrieveOwnersQuery } from './model/retrieve-owner.query';
import { RetrieveSensorQueryHandler } from './handler/sensor.handler';
import { RetrieveSensorsQueryHandler } from './handler/sensors.handler';
import { RetrieveOwnerQueryHandler } from './handler/retrieve-owner.handler';

const testObjects = [
    {
        _id: 'test-id',
        name: 'test-object',
    }, {
        _id: 'test-id-2',
        name: 'test-object-2',
    },
];

const mockRepository = {
    find: (values) => Object.keys(values).length ? testObjects.filter((owner) => owner._id === values._id) : testObjects,
};

describe('Query (integration)', () => {
    let moduleRef;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                CqrsModule,
                EventStoreModule,
            ],
            controllers: [
                OwnerController,
                SensorController,
            ],
            providers: [
                OwnerGateway,
                SensorGateway,
                EventPublisher,
                OwnerProcessor,
                SensorProcessor,
                RetrieveOwnerQueryHandler,
                RetrieveSensorQueryHandler,
                RetrieveSensorsQueryHandler,
                {
                    provide: getModelToken('Owner'),
                    useValue: mockRepository,
                }, {
                    provide: getModelToken('Sensor'),
                    useValue: mockRepository,
                },
            ],
        }).compile();
    });

    it(`Should retrieve an owner`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const ownerQueryHandler: RetrieveOwnerQueryHandler = moduleRef.get(RetrieveOwnerQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RetrieveOwnersQuery) => ownerQueryHandler.execute(c));

        let owners;
        try {
            owners = await commandBus.execute(new RetrieveOwnersQuery('test-id'));
        } catch {
            owners = [];
        }

        expect(owners).toHaveLength(1);
    });

    it(`Should retrieve a sensor`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const sensorQueryHandler: RetrieveSensorQueryHandler = moduleRef.get(RetrieveSensorQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RetrieveSensorQuery) => sensorQueryHandler.execute(c));

        let sensors;
        try {
            sensors = await commandBus.execute(new RetrieveSensorQuery('test-id'));
        } catch {
            sensors = [];
        }

        expect(sensors).toHaveLength(1);
    });

    it(`Should retrieve sensors`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const sensorsQueryHandler: RetrieveSensorsQueryHandler = moduleRef.get(RetrieveSensorsQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RetrieveSensorsQuery) => sensorsQueryHandler.execute(c));

        let sensors;
        try {
            sensors = await commandBus.execute(new RetrieveSensorsQuery());
        } catch {
            sensors = [];
        }

        expect(sensors).toHaveLength(2);
    });
});
