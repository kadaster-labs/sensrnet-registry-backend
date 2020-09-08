import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { EventStoreModule } from '../../src/event-store/event-store.module';
import { OwnerController } from '../../src/query/controller/owner.controller';
import { SensorController } from '../../src/query/controller/sensor.controller';
import { OwnerGateway } from '../../src/query/gateway/owner.gateway';
import { SensorGateway } from '../../src/query/gateway/sensor.gateway';
import { OwnerProcessor } from '../../src/query/processor/owner.processor';
import { SensorProcessor } from '../../src/query/processor/sensor.processor';
import { RetrieveOwnerQueryHandler } from '../../src/query/handler/retrieve-owner.handler';
import { RetrieveSensorQueryHandler } from '../../src/query/handler/sensor.handler';
import { RetrieveSensorsQueryHandler } from '../../src/query/handler/sensors.handler';
import { getModelToken } from '@nestjs/mongoose';
import { RetrieveOwnersQuery } from '../../src/query/model/retrieve-owner.query';

const logger: Logger = new Logger();

const mockRepository = {
    find() {
        return [];
    },
};

describe('Queries (integration)', () => {
    const getModuleRef = async () => {
        return await Test.createTestingModule({
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
    };

    it(`Should query owner`, async () => {
        const moduleRef = await getModuleRef();
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
});
