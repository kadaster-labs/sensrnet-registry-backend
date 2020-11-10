import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { OrganizationGateway } from './gateway/organization.gateway';
import { SensorGateway } from './gateway/sensor.gateway';
import { RetrieveSensorQuery } from './model/sensor.query';
import { RetrieveSensorsQuery } from './model/sensors.query';
import { OrganizationProcessor } from './processor/organization.processor';
import { SensorProcessor } from './processor/sensor.processor';
import { OrganizationController } from './controller/organization.controller';
import { SensorController } from './controller/sensor.controller';
import { RetrieveOrganizationQuery } from './model/retrieve-organization.query';
import { EventStoreModule } from '../event-store/event-store.module';
import { RetrieveSensorQueryHandler } from './handler/sensor.handler';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { RetrieveSensorsQueryHandler } from './handler/sensors.handler';
import { RetrieveOrganizationQueryHandler } from './handler/retrieve-organization.handler';
import { AccessJwtStrategy } from '../auth/access-jwt.strategy';

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
                OrganizationController,
                SensorController,
            ], providers: [
                OrganizationGateway,
                SensorGateway,
                EventPublisher,
                OrganizationProcessor,
                SensorProcessor,
                RetrieveOrganizationQueryHandler,
                RetrieveSensorQueryHandler,
                RetrieveSensorsQueryHandler,
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
                    provide: getModelToken('Organization'),
                    useValue: mockRepository,
                },
            ],
        }).compile();
    });

    it(`Should retrieve an organization`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const ownerQueryHandler: RetrieveOrganizationQueryHandler = moduleRef.get(RetrieveOrganizationQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RetrieveOrganizationQuery) => ownerQueryHandler.execute(c));

        let owners;
        try {
            owners = await commandBus.execute(new RetrieveOrganizationQuery('test-id'));
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
        } finally {
            expect(sensors).toBeDefined();
        }
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
