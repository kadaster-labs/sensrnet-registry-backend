import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { EventStore } from '../../src/event-store/event-store';
import { UpdateOwnerCommand } from '../../src/command/model/update-owner.command';
import { DeleteOwnerCommand } from '../../src/command/model/delete-owner.command';
import { ExistingOwnerEventStoreMock } from './existing-owner.mock';
import { OwnerAggregate } from '../../src/core/aggregates/owner.aggregate';
import { RegisterOwnerCommand } from '../../src/command/model/register-owner.command';
import { NonExistingOwnerEventStoreMock } from './nonexisting-owner.mock';
import { OwnerRepository } from '../../src/core/repositories/owner.repository';
import { SensorRepository } from '../../src/core/repositories/sensor.repository';
import { EventStorePublisher } from '../../src/event-store/event-store.publisher';
import { UpdateOwnerCommandHandler } from '../../src/command/handler/update-owner.handler';
import { DeleteOwnerCommandHandler } from '../../src/command/handler/delete-owner.handler';
import { CreateSensorCommandHandler } from '../../src/command/handler/create-sensor.handler';
import { UpdateSensorCommandHandler } from '../../src/command/handler/update-sensor.handler';
import { DeleteSensorCommandHandler } from '../../src/command/handler/delete-sensor.handler';
import { RegisterOwnerCommandHandler } from '../../src/command/handler/register-owner.handler';
import { CommandBus, CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { ActivateSensorCommandHandler } from '../../src/command/handler/activate-sensor.handler';
import { DeactivateSensorCommandHandler } from '../../src/command/handler/deactivate-sensor.handler';
import { CreateDatastreamCommandHandler } from '../../src/command/handler/create-datastream.handler';
import { DeleteDataStreamCommandHandler } from '../../src/command/handler/delete-datastream.handler';
import { UpdateSensorLocationCommandHandler } from '../../src/command/handler/update-sensor-location.handler';
import { ShareSensorOwnershipCommandHandler } from '../../src/command/handler/share-sensor-ownership.handler';
import { TransferSensorOwnershipCommandHandler } from '../../src/command/handler/transfer-sensor-ownership.handler';

describe('Commands (integration)', () => {
    const getModuleRef = async (EventStoreProvider) => {
        return await Test.createTestingModule({
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
    };

    const getCommandPipeline = async (eventStoreProvider) => {
        const moduleRef = await getModuleRef(eventStoreProvider);

        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const eventPublisher: EventPublisher = moduleRef.get(EventPublisher);
        const ownerAggregate: OwnerAggregate = moduleRef.get(OwnerAggregate);
        const ownerRepository: OwnerRepository = moduleRef.get(OwnerRepository);
        jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(() => ownerAggregate);

        return { commandBus, eventPublisher, ownerAggregate, ownerRepository };
    };

    it(`Should register an owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: NonExistingOwnerEventStoreMock,
        };
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getCommandPipeline(eventStoreProvider);

        const commandHandler = new RegisterOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RegisterOwnerCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(ownerAggregate, 'register');

        const ownerId = v4();
        await commandBus.execute(new RegisterOwnerCommand(ownerId, 'test-org',
            'www.test-org.nl', 'test-name', 'test-owner@test-org.com',
            'test-phone'));

        expect(registerFn).toBeCalled();
    });

    it(`Should update an owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: ExistingOwnerEventStoreMock,
        };
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getCommandPipeline(eventStoreProvider);

        const commandHandler = new UpdateOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: UpdateOwnerCommand) => commandHandler.execute(c));
        const updateFn = jest.spyOn(ownerAggregate, 'update');

        const ownerId = v4();
        await commandBus.execute(new UpdateOwnerCommand(ownerId, 'test-org',
            'www.test-org.nl', 'test-name', 'test-owner@test-org.com',
            'test-phone'));

        expect(updateFn).toBeCalled();
    });

    it(`Should delete an owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: ExistingOwnerEventStoreMock,
        };
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getCommandPipeline(eventStoreProvider);

        const commandHandler = new DeleteOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: DeleteOwnerCommand) => commandHandler.execute(c));
        const updateFn = jest.spyOn(ownerAggregate, 'delete');

        const ownerId = v4();
        await commandBus.execute(new DeleteOwnerCommand(ownerId));

        expect(updateFn).toBeCalled();
    });
});
