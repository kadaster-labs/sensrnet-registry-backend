import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EventStore } from '../../src/event-store/event-store';
import { UpdateOwnerCommand } from '../../src/command/model/update-owner.command';
import { DeleteOwnerCommand } from '../../src/command/model/delete-owner.command';
import { ExistingEventStoreMock } from './existing.mock';
import { OwnerAggregate } from '../../src/core/aggregates/owner.aggregate';
import { SensorAggregate } from '../../src/core/aggregates/sensor.aggregate';
import { RegisterOwnerCommand } from '../../src/command/model/register-owner.command';
import { NonExistingEventStoreMock } from './nonexisting.mock';
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

const logger: Logger = new Logger();

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
                SensorAggregate,
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

    const getOwnerCommandPipeline = async (eventStoreProvider) => {
        const moduleRef = await getModuleRef(eventStoreProvider);
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const eventPublisher: EventPublisher = moduleRef.get(EventPublisher);
        const ownerAggregate: OwnerAggregate = moduleRef.get(OwnerAggregate);
        const ownerRepository: OwnerRepository = moduleRef.get(OwnerRepository);
        jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(() => ownerAggregate);

        return { commandBus, eventPublisher, ownerAggregate, ownerRepository };
    };

    const registerOwner = async (eventStoreProvider) => {
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new RegisterOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RegisterOwnerCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(ownerAggregate, 'register');

        try {
            await commandBus.execute(new RegisterOwnerCommand('test-id', 'test-org',
                'www.test-org.nl', 'test-name', 'test-owner@test-org.com',
                'test-phone'));
        } catch {
            logger.log('Failed to register.');
        }

        return registerFn;
    };

    const updateOwner = async (eventStoreProvider) => {
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new UpdateOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: UpdateOwnerCommand) => commandHandler.execute(c));
        const updateFn = jest.spyOn(ownerAggregate, 'update');

        try {
            await commandBus.execute(new UpdateOwnerCommand('test-id', 'test-org',
                'www.test-org.nl', 'test-name', 'test-owner@test-org.com',
                'test-phone'));
        } catch {
            logger.log('Failed to update.');
        }

        return updateFn;
    };

    const deleteOwner = async (eventStoreProvider) => {
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new DeleteOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: DeleteOwnerCommand) => commandHandler.execute(c));
        const deleteFn = jest.spyOn(ownerAggregate, 'delete');

        try {
            await commandBus.execute(new DeleteOwnerCommand('test-id'));
        } catch {
            logger.log('Failed to delete owner');
        }

        return deleteFn;
    };

    it(`Should register owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: NonExistingEventStoreMock,
        };

        const registerFn = await registerOwner(eventStoreProvider);
        expect(registerFn).toBeCalled();
    });

    it(`Should not register owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: ExistingEventStoreMock,
        };

        const registerFn = await registerOwner(eventStoreProvider);
        expect(registerFn).not.toHaveBeenCalled();
    });

    it(`Should update owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: ExistingEventStoreMock,
        };

        const updateFn = await updateOwner(eventStoreProvider);
        expect(updateFn).toBeCalled();
    });

    it(`Should not update owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: NonExistingEventStoreMock,
        };

        const updateFn = await updateOwner(eventStoreProvider);
        expect(updateFn).not.toBeCalled();
    });

    it(`Should delete owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: ExistingEventStoreMock,
        };

        const deleteFn = await deleteOwner(eventStoreProvider);
        expect(deleteFn).toBeCalled();
    });

    it(`Should not delete owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: NonExistingEventStoreMock,
        };

        const deleteFn = await deleteOwner(eventStoreProvider);
        expect(deleteFn).not.toBeCalled();
    });
});
