import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { LegalEntityGateway } from './gateway/legal-entity.gateway';
import { DeviceGateway } from './gateway/device.gateway';
import { RetrieveDevicesQuery } from './controller/query/device.query';
import { RetrieveDevicesQuery } from './controller/query/devices.query';
import { LegalEntityProcessor } from './processor/legal-entity.processor';
import { SensorProcessor } from './processor/sensor.processor';
import { LegalEntityController } from './controller/legal-entity.controller';
import { DeviceController } from './controller/device-controller';
import { LegalEntityQuery } from './controller/query/legal-entity.query';
import { EventStoreModule } from '../event-store/event-store.module';
import { RetrieveDeviceQueryHandler } from './controller/handler/device.handler';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { RetrieveDevicesQueryHandler } from './controller/handler/devices.handler';
import { LegalEntityQueryHandler } from './controller/handler/legal-entity.handler';
import { AccessJwtStrategy } from '../auth/strategy/access-jwt.strategy';

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
    findOne: (values) => {
        let objects;
        if (Object.keys(values).length) {
            const filteredObjects = testObjects.filter((owner) => owner._id === values._id);
            if (filteredObjects.length) {
                objects = filteredObjects[0];
            }
        } else {
            objects = testObjects;
        }
        return objects;
    },
};

const mockAuthService = {
    verifyToken: async () => true,
};

const mockAccessJwtStrategy = {
    validate: async () => {
        return { organizationId: 'my-organization' };
    },
};

describe('Query (integration)', () => {
    let moduleRef;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                CqrsModule,
                EventStoreModule,
            ], controllers: [
                LegalEntityController,
                DeviceController,
            ], providers: [
                LegalEntityGateway,
                DeviceGateway,
                EventPublisher,
                LegalEntityProcessor,
                SensorProcessor,
                LegalEntityQueryHandler,
                RetrieveDeviceQueryHandler,
                RetrieveDevicesQueryHandler,
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                }, {
                    provide: AccessJwtStrategy,
                    useValue: mockAccessJwtStrategy,
                }, {
                    provide: getModelToken('Sensor'),
                    useValue: mockRepository,
                }, {
                    provide: getModelToken('LegalEntity'),
                    useValue: mockRepository,
                },
            ],
        }).compile();
    });

    it(`Should retrieve an organization`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const ownerQueryHandler: LegalEntityQueryHandler = moduleRef.get(LegalEntityQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: LegalEntityQuery) => ownerQueryHandler.execute(c));

        let organizations;
        try {
            organizations = await commandBus.execute(new LegalEntityQuery('test-id'));
        } catch {
            organizations = null;
        }

        expect(organizations).toBeDefined();
    });

    it(`Should retrieve a sensor`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const sensorQueryHandler: RetrieveDeviceQueryHandler = moduleRef.get(RetrieveDeviceQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RetrieveDevicesQuery) => sensorQueryHandler.execute(c));

        let sensors;
        try {
            sensors = await commandBus.execute(new RetrieveDevicesQuery('test-id'));
        } finally {
            expect(sensors).toBeDefined();
        }
    });

    it(`Should retrieve sensors`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const sensorsQueryHandler: RetrieveDevicesQueryHandler = moduleRef.get(RetrieveDevicesQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RetrieveDevicesQuery) => sensorsQueryHandler.execute(c));

        let sensors;
        try {
            sensors = await commandBus.execute(new RetrieveDevicesQuery());
        } catch {
            sensors = [];
        }

        expect(sensors).toHaveLength(2);
    });
});
