import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EventStore } from '../event-store/event-store';
import { OwnerAggregate } from '../core/aggregates/owner.aggregate';
import { SensorAggregate } from '../core/aggregates/sensor.aggregate';
import { OwnerRepository } from '../core/repositories/owner.repository';
import { LocationBody } from './controller/model/location.body';
import { CommandBus, CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { SensorRepository } from '../core/repositories/sensor.repository';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { UpdateOwnerCommand } from './model/update-owner.command';
import { DeleteOwnerCommand } from './model/delete-owner.command';
import { CreateSensorCommand } from './model/create-sensor.command';
import { UpdateSensorCommand } from './model/update-sensor.command';
import { RegisterOwnerCommand } from './model/register-owner.command';
import { UpdateOwnerCommandHandler } from './handler/update-owner.handler';
import { DeleteOwnerCommandHandler } from './handler/delete-owner.handler';
import { CreateSensorCommandHandler } from './handler/create-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/update-sensor.handler';
import { DeleteSensorCommandHandler } from './handler/delete-sensor.handler';
import { RegisterOwnerCommandHandler } from './handler/register-owner.handler';
import { ActivateSensorCommandHandler } from './handler/activate-sensor.handler';
import { DeactivateSensorCommandHandler } from './handler/deactivate-sensor.handler';
import { CreateDatastreamCommandHandler } from './handler/create-datastream.handler';
import { DeleteDataStreamCommandHandler } from './handler/delete-datastream.handler';
import { ShareSensorOwnershipCommand } from './model/share-sensor-ownership.command';
import { TransferSensorOwnershipCommand } from './model/transfer-sensor-ownership.command';
import { UpdateSensorLocationCommandHandler } from './handler/update-sensor-location.handler';
import { ShareSensorOwnershipCommandHandler } from './handler/share-sensor-ownership.handler';
import { TransferSensorOwnershipCommandHandler } from './handler/transfer-sensor-ownership.handler';

const logger: Logger = new Logger();

const getEsMock = (ownerExist, sensorExist) => {
    return function ExistingEventStoreMock() {
        this.exists = async (aggId) => aggId.split('-')[0] === 'owner' ? ownerExist : sensorExist;
        this.getEvents = () => [];
        this.connect = (): void => void 0;
    };
};

describe('Command (integration)', () => {
    const getModuleRef = async (...Providers) => {
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
                // mocked providers
                ...Providers,
            ],
        }).compile();
    };

    const getOwnerCommandPipeline = async (eventStoreProvider) => {
        const moduleRef = await getModuleRef(eventStoreProvider);
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const eventPublisher: EventPublisher = moduleRef.get(EventPublisher);
        const ownerAggregate: OwnerAggregate = moduleRef.get(OwnerAggregate);
        const sensorAggregate: SensorAggregate = moduleRef.get(SensorAggregate);
        const ownerRepository: OwnerRepository = moduleRef.get(OwnerRepository);
        const sensorRepository: SensorRepository = moduleRef.get(SensorRepository);
        const mergeObjectImpl = (a) => a instanceof OwnerAggregate ? ownerAggregate : sensorAggregate;
        jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(mergeObjectImpl);

        return { commandBus, eventPublisher, ownerAggregate, sensorAggregate, ownerRepository, sensorRepository };
    };

    const registerOwner = async (eventStoreProvider) => {
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new RegisterOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RegisterOwnerCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(ownerAggregate, 'onOwnerRegistered');

        try {
            await commandBus.execute(new RegisterOwnerCommand('test-id', 'test-org',
                'test-site', 'test-name', 'test-mail', 'test-phone'));
        } catch {
            logger.log('Failed to register.');
        }

        return registerFn;
    };

    it(`Should register owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, false),
        };

        const registerFn = await registerOwner(eventStoreProvider);
        expect(registerFn).toBeCalled();
    });

    it(`Should not register owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, true),
        };

        const registerFn = await registerOwner(eventStoreProvider);
        expect(registerFn).not.toHaveBeenCalled();
    });

    const updateOwner = async (eventStoreProvider) => {
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new UpdateOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: UpdateOwnerCommand) => commandHandler.execute(c));
        const updateFn = jest.spyOn(ownerAggregate, 'onOwnerUpdated');

        try {
            await commandBus.execute(new UpdateOwnerCommand('test-id', 'test-org',
                'test-site', 'test-name', 'test-mail', 'test-phone'));
        } catch {
            logger.log('Failed to update.');
        }

        return updateFn;
    };

    it(`Should update owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, true),
        };

        const updateFn = await updateOwner(eventStoreProvider);
        expect(updateFn).toBeCalled();
    });

    it(`Should not update owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, false),
        };

        const updateFn = await updateOwner(eventStoreProvider);
        expect(updateFn).not.toBeCalled();
    });

    const deleteOwner = async (eventStoreProvider) => {
        const { commandBus, eventPublisher, ownerAggregate, ownerRepository } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new DeleteOwnerCommandHandler(eventPublisher, ownerRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: DeleteOwnerCommand) => commandHandler.execute(c));
        const deleteFn = jest.spyOn(ownerAggregate, 'onOwnerDeleted');

        try {
            await commandBus.execute(new DeleteOwnerCommand('test-id'));
        } catch {
            logger.log('Failed to delete owner');
        }

        return deleteFn;
    };

    it(`Should delete owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, true),
        };

        const deleteFn = await deleteOwner(eventStoreProvider);
        expect(deleteFn).toBeCalled();
    });

    it(`Should not delete owner`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, false),
        };

        const deleteFn = await deleteOwner(eventStoreProvider);
        expect(deleteFn).not.toBeCalled();
    });

    const registerSensor = async (eventStoreProvider) => {
        const {
            commandBus,
            eventPublisher,
            sensorAggregate,
            ownerRepository,
            sensorRepository,
        } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new CreateSensorCommandHandler(eventPublisher, ownerRepository, sensorRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: CreateSensorCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(sensorAggregate, 'onSensorRegistered');

        try {
            await commandBus.execute(new CreateSensorCommand('test-id', 'test-id', 'test-name',
                {latitude: 0, longitude: 0} as LocationBody, [], 'test-aim', 'test-description',
                'test-manufacturer', true, undefined, 'test-url', undefined,
                'test-type', undefined));
        } catch {
            logger.log('Failed to register.');
        }

        return registerFn;
    };

    it(`Should register sensor`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, false),
        };

        const registerFn = await registerSensor(eventStoreProvider);
        expect(registerFn).toBeCalled();
    });

    it(`Should not register sensor`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, false),
        };

        const registerFn = await registerSensor(eventStoreProvider);
        expect(registerFn).not.toBeCalled();
    });

    it(`Should not register sensor`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, true),
        };

        const registerFn = await registerSensor(eventStoreProvider);
        expect(registerFn).not.toBeCalled();
    });

    it(`Should not register sensor`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, true),
        };

        const registerFn = await registerSensor(eventStoreProvider);
        expect(registerFn).not.toBeCalled();
    });

    const register = (sensorAggregate) => {
        sensorAggregate.register('test-id', 'test-name',
            {latitude: 0, longitude: 0} as LocationBody, [], 'test-aim', 'test-description',
            'test-manufacturer', true, undefined, 'test-url', undefined,
            'test-type', undefined);
    };

    const updateSensor = async (eventStoreProvider, isRegistered) => {
        const {
            commandBus,
            eventPublisher,
            sensorAggregate,
            sensorRepository,
        } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new UpdateSensorCommandHandler(eventPublisher, sensorRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: UpdateSensorCommand) => commandHandler.execute(c));
        const updateFn = jest.spyOn(sensorAggregate, 'onSensorUpdated');

        if (isRegistered) {
            register(sensorAggregate);
        }

        try {
            await commandBus.execute(new UpdateSensorCommand('test-id', 'test-id', 'test-name',
                'test-aim', 'test-description', 'test-manufacturer', undefined,
                'test-url', undefined, 'test-type', undefined));
        } catch {
            logger.log('Failed to update.');
        }

        return updateFn;
    };

    it(`Should update sensor`, async () => {
        const sensorExists = true;
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, sensorExists),
        };

        const updateFn = await updateSensor(eventStoreProvider, sensorExists);
        expect(updateFn).toBeCalled();
    });

    it(`Should not update sensor`, async () => {
        const sensorExists = false;
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, sensorExists),
        };

        const updateFn = await updateSensor(eventStoreProvider, sensorExists);
        expect(updateFn).not.toBeCalled();
    });

    const transferSensor = async (eventStoreProvider, isRegistered) => {
        const {
            commandBus,
            eventPublisher,
            sensorAggregate,
            ownerRepository,
            sensorRepository,
        } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new TransferSensorOwnershipCommandHandler(eventPublisher, ownerRepository, sensorRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: TransferSensorOwnershipCommand) => commandHandler.execute(c));
        const transferFn = jest.spyOn(sensorAggregate, 'onSensorOwnershipTransferred');

        if (isRegistered) {
            register(sensorAggregate);
        }

        try {
            await commandBus.execute(new TransferSensorOwnershipCommand('test-id', 'test-id',
                'new-test-id'));
        } catch {
            logger.log('Failed to transfer.');
        }

        return transferFn;
    };

    it(`Should transfer sensor ownership`, async () => {
        const sensorExists = true;
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, sensorExists),
        };

        const transferFn = await transferSensor(eventStoreProvider, sensorExists);
        expect(transferFn).toBeCalled();
    });

    it(`Should not transfer sensor ownership`, async () => {
        const sensorExists = true;
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, sensorExists),
        };

        const transferFn = await transferSensor(eventStoreProvider, sensorExists);
        expect(transferFn).not.toBeCalled();
    });

    const shareSensor = async (eventStoreProvider, isRegistered) => {
        const {
            commandBus,
            eventPublisher,
            sensorAggregate,
            ownerRepository,
            sensorRepository,
        } = await getOwnerCommandPipeline(eventStoreProvider);

        const commandHandler = new ShareSensorOwnershipCommandHandler(eventPublisher, ownerRepository, sensorRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: ShareSensorOwnershipCommand) => commandHandler.execute(c));
        const shareFn = jest.spyOn(sensorAggregate, 'onSensorOwnershipShared');

        if (isRegistered) {
            register(sensorAggregate);
        }

        try {
            await commandBus.execute(new ShareSensorOwnershipCommand('test-id', 'test-id',
                ['new-test-id']));
        } catch {
            logger.log('Failed to share.');
        }

        return shareFn;
    };

    it(`Should share sensor ownership`, async () => {
        const sensorExists = true;
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, sensorExists),
        };

        const shareFn = await shareSensor(eventStoreProvider, sensorExists);
        expect(shareFn).toBeCalled();
    });

    it(`Should not sensor ownership`, async () => {
        const sensorExists = false;
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, sensorExists),
        };

        const shareFn = await shareSensor(eventStoreProvider, sensorExists);
        expect(shareFn).not.toBeCalled();
    });

});
