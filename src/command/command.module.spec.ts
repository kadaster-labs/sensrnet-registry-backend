import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EventStore } from '../event-store/event-store';
import { CreateSensorCommand } from './model/create-sensor.command';
import { UpdateSensorCommand } from './model/update-sensor.command';
import { SensorAggregate } from '../core/aggregates/sensor.aggregate';
import { SensorRepository } from '../core/repositories/sensor.repository';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { CreateSensorCommandHandler } from './handler/create-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/update-sensor.handler';
import { DeleteSensorCommandHandler } from './handler/delete-sensor.handler';
import { CommandBus, CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { UpdateOrganizationCommand } from './model/update-organization.command';
import { DeleteOrganizationCommand } from './model/delete-organization.command';
import { OrganizationAggregate } from '../core/aggregates/organization.aggregate';
import { ActivateSensorCommandHandler } from './handler/activate-sensor.handler';
import { RegisterOrganizationCommand } from './model/register-organization.command';
import { DeactivateSensorCommandHandler } from './handler/deactivate-sensor.handler';
import { CreateDatastreamCommandHandler } from './handler/create-datastream.handler';
import { DeleteDataStreamCommandHandler } from './handler/delete-datastream.handler';
import { ShareSensorOwnershipCommand } from './model/share-sensor-ownership.command';
import { UpdateOrganizationCommandHandler } from './handler/update-organization.handler';
import { DeleteOrganizationCommandHandler } from './handler/delete-organization.handler';
import { TransferSensorOwnershipCommand } from './model/transfer-sensor-ownership.command';
import { RegisterOrganizationCommandHandler } from './handler/register-organization.handler';
import { OrganizationRepository } from '../core/repositories/organization-repository.service';
import { UpdateSensorLocationCommandHandler } from './handler/update-sensor-location.handler';
import { ShareSensorOwnershipCommandHandler } from './handler/share-sensor-ownership.handler';
import { TransferSensorOwnershipCommandHandler } from './handler/transfer-sensor-ownership.handler';

const logger: Logger = new Logger();

const getEsMock = (organizationExist, sensorExist) => {
    return function ExistingEventStoreMock() {
        this.exists = async (aggId) => aggId.split('-')[0] === 'organization' ? organizationExist : sensorExist;
        this.getEvents = () => [];
        this.connect = (): void => void 0;
    };
};

describe('Command (integration)', () => {
    const getModuleRef = async (...Providers) => {
        return await Test.createTestingModule({
            imports: [
                CqrsModule,
            ], providers: [
                EventBus,
                EventPublisher,
                OrganizationAggregate,
                SensorAggregate,
                OrganizationRepository,
                SensorRepository,
                EventStorePublisher,
                // organization
                UpdateOrganizationCommandHandler,
                DeleteOrganizationCommandHandler,
                RegisterOrganizationCommandHandler,
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

    const getOrganizationCommandPipeline = async (eventStoreProvider) => {
        const moduleRef = await getModuleRef(eventStoreProvider);
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const eventPublisher: EventPublisher = moduleRef.get(EventPublisher);
        const organizationAggregate: OrganizationAggregate = moduleRef.get(OrganizationAggregate);
        const sensorAggregate: SensorAggregate = moduleRef.get(SensorAggregate);
        const organizationRepository: OrganizationRepository = moduleRef.get(OrganizationRepository);
        const sensorRepository: SensorRepository = moduleRef.get(SensorRepository);
        const mergeObjectImpl = (a) => a instanceof OrganizationAggregate ? organizationAggregate : sensorAggregate;
        jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(mergeObjectImpl);

        return { commandBus, eventPublisher, organizationAggregate, sensorAggregate, organizationRepository, sensorRepository };
    };

    const registerOrganization = async (eventStoreProvider) => {
        const { commandBus, eventPublisher,
            organizationAggregate, organizationRepository } = await getOrganizationCommandPipeline(eventStoreProvider);

        const commandHandler = new RegisterOrganizationCommandHandler(eventPublisher, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RegisterOrganizationCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(organizationAggregate, 'onOrganizationRegistered');

        try {
            await commandBus.execute(new RegisterOrganizationCommand('test-id', 'test-site',
                'test-name', 'test-mail', 'test-phone'));
        } catch {
            logger.log('Failed to register organization.');
        }

        return registerFn;
    };

    it(`Should register organization`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, false),
        };

        const registerFn = await registerOrganization(eventStoreProvider);
        expect(registerFn).toBeCalled();
    });

    it(`Should not register organization`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, true),
        };

        const registerFn = await registerOrganization(eventStoreProvider);
        expect(registerFn).not.toHaveBeenCalled();
    });

    const updateOrganization = async (eventStoreProvider) => {
        const { commandBus, eventPublisher,
            organizationAggregate, organizationRepository } = await getOrganizationCommandPipeline(eventStoreProvider);

        const commandHandler = new UpdateOrganizationCommandHandler(eventPublisher, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: UpdateOrganizationCommand) => commandHandler.execute(c));
        const updateFn = jest.spyOn(organizationAggregate, 'onOrganizationUpdated');

        try {
            await commandBus.execute(new UpdateOrganizationCommand('test-id', 'test-site',
                'test-name', 'test-mail', 'test-phone'));
        } catch {
            logger.log('Failed to update organization.');
        }

        return updateFn;
    };

    it(`Should update organization`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, true),
        };

        const updateFn = await updateOrganization(eventStoreProvider);
        expect(updateFn).toBeCalled();
    });

    it(`Should not update organization`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, false),
        };

        const updateFn = await updateOrganization(eventStoreProvider);
        expect(updateFn).not.toBeCalled();
    });

    const deleteOrganization = async (eventStoreProvider) => {
        const { commandBus, eventPublisher,
            organizationAggregate, organizationRepository } = await getOrganizationCommandPipeline(eventStoreProvider);

        const commandHandler = new DeleteOrganizationCommandHandler(eventPublisher, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: DeleteOrganizationCommand) => commandHandler.execute(c));
        const deleteFn = jest.spyOn(organizationAggregate, 'onOrganizationDeleted');

        try {
            await commandBus.execute(new DeleteOrganizationCommand('test-id'));
        } catch {
            logger.log('Failed to delete organization');
        }

        return deleteFn;
    };

    it(`Should delete organization`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, true),
        };

        const deleteFn = await deleteOrganization(eventStoreProvider);
        expect(deleteFn).toBeCalled();
    });

    it(`Should not delete organization`, async () => {
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(false, false),
        };

        const deleteFn = await deleteOrganization(eventStoreProvider);
        expect(deleteFn).not.toBeCalled();
    });

    const registerSensor = async (eventStoreProvider) => {
        const {
            commandBus,
            eventPublisher,
            sensorAggregate,
            sensorRepository,
            organizationRepository,
        } = await getOrganizationCommandPipeline(eventStoreProvider);

        const commandHandler = new CreateSensorCommandHandler(eventPublisher, sensorRepository, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: CreateSensorCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(sensorAggregate, 'onSensorRegistered');

        try {
            await commandBus.execute(new CreateSensorCommand('test-id', 'test-id', 'test-name',
                [0, 0, 0], 'test-base-id',  [], 'test-aim', 'test-description',
                'test-manufacturer', true, undefined, 'test-url', undefined,
                'test-category', 'test-type', undefined));
        } catch {
            logger.log('Failed to register sensor.');
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
        sensorAggregate.register('test-id', 'test-name', [0, 0, 0], [], 'test-aim', 'test-description',
            'test-manufacturer', true, undefined, 'test-url', undefined, 'test-type', undefined);
    };

    const updateSensor = async (eventStoreProvider, isRegistered) => {
        const {
            commandBus,
            eventPublisher,
            sensorAggregate,
            sensorRepository,
        } = await getOrganizationCommandPipeline(eventStoreProvider);

        const commandHandler = new UpdateSensorCommandHandler(eventPublisher, sensorRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: UpdateSensorCommand) => commandHandler.execute(c));
        const updateFn = jest.spyOn(sensorAggregate, 'onSensorUpdated');

        if (isRegistered) {
            register(sensorAggregate);
        }

        try {
            await commandBus.execute(new UpdateSensorCommand('test-id', 'test-id', 'test-name',
                'test-aim', 'test-description', 'test-manufacturer', undefined,
                'test-url', undefined, 'test-category', 'test-type', undefined));
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
            sensorRepository,
            organizationRepository,
        } = await getOrganizationCommandPipeline(eventStoreProvider);

        const commandHandler = new TransferSensorOwnershipCommandHandler(eventPublisher, sensorRepository, organizationRepository);
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
            sensorRepository,
            organizationRepository,
        } = await getOrganizationCommandPipeline(eventStoreProvider);

        const commandHandler = new ShareSensorOwnershipCommandHandler(eventPublisher, sensorRepository, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: ShareSensorOwnershipCommand) => commandHandler.execute(c));
        const shareFn = jest.spyOn(sensorAggregate, 'onSensorOwnershipShared');

        if (isRegistered) {
            register(sensorAggregate);
        }

        try {
            await commandBus.execute(new ShareSensorOwnershipCommand('test-id', 'test-id', 'new-test-id'));
        } catch {
            logger.log('Failed to share ownership.');
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

    it(`Should not share sensor ownership`, async () => {
        const sensorExists = false;
        const eventStoreProvider = {
            provide: EventStore,
            useClass: getEsMock(true, sensorExists),
        };

        const shareFn = await shareSensor(eventStoreProvider, sensorExists);
        expect(shareFn).not.toBeCalled();
    });
});
