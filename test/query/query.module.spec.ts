import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { OwnerGateway } from '../../src/query/gateway/owner.gateway';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SensorGateway } from '../../src/query/gateway/sensor.gateway';
import { RetrieveSensorQuery } from '../../src/query/model/sensor.query';
import { RetrieveSensorsQuery } from '../../src/query/model/sensors.query';
import { OwnerProcessor } from '../../src/query/processor/owner.processor';
import { EventStoreModule } from '../../src/event-store/event-store.module';
import { SensorProcessor } from '../../src/query/processor/sensor.processor';
import { OwnerController } from '../../src/query/controller/owner.controller';
import { SensorController } from '../../src/query/controller/sensor.controller';
import { RetrieveOwnersQuery } from '../../src/query/model/retrieve-owner.query';
import { RetrieveSensorQueryHandler } from '../../src/query/handler/sensor.handler';
import { RetrieveSensorsQueryHandler } from '../../src/query/handler/sensors.handler';
import { RetrieveOwnerQueryHandler } from '../../src/query/handler/retrieve-owner.handler';

const logger: Logger = new Logger();

const mockRepository = {
    find: () => [],
};

describe('Queries (integration)', () => {
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

        let result;
        try {
            result = await commandBus.execute(new RetrieveOwnersQuery('test-id'));
        } catch {
            logger.log('Failed to query.');
        }

        expect(result).toBeDefined();
    });

    it(`Should retrieve a sensor`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const sensorQueryHandler: RetrieveSensorQueryHandler = moduleRef.get(RetrieveSensorQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RetrieveSensorQuery) => sensorQueryHandler.execute(c));

        let result;
        try {
            result = await commandBus.execute(new RetrieveSensorQuery('test-id'));
        } catch {
            logger.log('Failed to query.');
        }

        expect(result).toBeDefined();
    });

    it(`Should retrieve sensors`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const sensorsQueryHandler: RetrieveSensorsQueryHandler = moduleRef.get(RetrieveSensorsQueryHandler);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RetrieveSensorsQuery) => sensorsQueryHandler.execute(c));

        let result;
        try {
            result = await commandBus.execute(new RetrieveSensorsQuery());
        } catch {
            logger.log('Failed to query.');
        }

        expect(result).toBeDefined();
    });
});
