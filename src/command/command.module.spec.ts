import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { EventStore } from '../event-store/event-store';
import { OwnerAggregate } from '../core/aggregates/owner.aggregate';
import { RegisterOwnerCommand } from './model/register-owner.command';
import { OwnerRepository } from '../core/repositories/owner.repository';
import { SensorRepository } from '../core/repositories/sensor.repository';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { UpdateOwnerCommandHandler } from './handler/update-owner.handler';
import { DeleteOwnerCommandHandler } from './handler/delete-owner.handler';
import { CreateSensorCommandHandler } from './handler/create-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/update-sensor.handler';
import { DeleteSensorCommandHandler } from './handler/delete-sensor.handler';
import { RegisterOwnerCommandHandler } from './handler/register-owner.handler';
import { CommandBus, CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { ActivateSensorCommandHandler } from './handler/activate-sensor.handler';
import { DeactivateSensorCommandHandler } from './handler/deactivate-sensor.handler';
import { CreateDatastreamCommandHandler } from './handler/create-datastream.handler';
import { DeleteDataStreamCommandHandler } from './handler/delete-datastream.handler';
import { UpdateSensorLocationCommandHandler } from './handler/update-sensor-location.handler';
import { ShareSensorOwnershipCommandHandler } from './handler/share-sensor-ownership.handler';
import { TransferSensorOwnershipCommandHandler } from './handler/transfer-sensor-ownership.handler';

class EventStoreMock {
    connect = () => void 0;
    exists = () => false;
}

describe('Commands (integration)', () => {
    let moduleRef;

    beforeAll(async () => {
        const EventStoreProvider = {
            provide: EventStore,
            useClass: EventStoreMock,
        };

        moduleRef = await Test.createTestingModule({
            imports: [
                CqrsModule,
            ],
            providers: [
                EventBus,
                EventPublisher,
                OwnerAggregate,
                OwnerRepository,
                SensorRepository,
                EventStoreProvider,
                EventStorePublisher,
                // owner
                UpdateOwnerCommandHandler,
                DeleteOwnerCommandHandler,
                RegisterOwnerCommandHandler,
                // sensor
                CreateSensorCommandHandler,
                UpdateSensorCommandHandler,
                DeleteSensorCommandHandler,
                ActivateSensorCommandHandler,
                DeactivateSensorCommandHandler,
                CreateDatastreamCommandHandler,
                DeleteDataStreamCommandHandler,
                UpdateSensorLocationCommandHandler,
                ShareSensorOwnershipCommandHandler,
                TransferSensorOwnershipCommandHandler,
            ],
        }).compile();
    });

    it(`Should register an owner`, async () => {
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const eventPublisher: EventPublisher = moduleRef.get(EventPublisher);
        const ownerAggregate: OwnerAggregate = moduleRef.get(OwnerAggregate);
        const ownerRepository: OwnerRepository = moduleRef.get(OwnerRepository);

        jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(() => ownerAggregate);

        const commandHandler = new RegisterOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RegisterOwnerCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(ownerAggregate, 'register');

        const ownerId = v4();
        await commandBus.execute(new RegisterOwnerCommand(ownerId, 'test-org',
            'www.test-org.nl', 'test-name', 'test-owner@test-org.com',
            'test-phone'));

        expect(registerFn).toBeCalled();
    });
});
