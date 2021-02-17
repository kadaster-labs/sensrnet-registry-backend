import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EventStore } from '../event-store/event-store';
import { RegisterSensorCommand } from './command/sensor/register-sensor.command';
import { UpdateSensorCommand } from './command/sensor/update-sensor.command';
import { SensorAggregate } from '../core/aggregates/sensor.aggregate';
import { SensorRepository } from '../core/repositories/sensor.repository';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { RegisterSensorCommandHandler } from './handler/model/sensor/register-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/model/sensor/update-sensor.handler';
import { DeleteSensorCommandHandler } from './handler/model/sensor/delete-sensor.handler';
import { CommandBus, CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { UpdateLegalEntityCommand } from './command/legal-entity/update-legal-entity.command';
import { DeleteLegalEntityCommand } from './command/legal-entity/delete-legal-entity.command';
import { LegalEntityAggregate } from '../core/aggregates/legal-entity.aggregate';
import { RegisterLegalEntityCommand } from './command/legal-entity/register-legal-entity.command';
import { CreateDataStreamCommandHandler } from './handler/model/data-stream/register-datastream.handler';
import { DeleteDataStreamCommandHandler } from './handler/model/data-stream/delete-datastream.handler';
import { UpdateLegalEntityCommandHandler } from './handler/model/legal-entity/update-legal-entity.handler';
import { DeleteLegalEntityCommandHandler } from './handler/model/legal-entity/delete-legal-entity.handler';
import { RegisterLegalEntityCommandHandler } from './handler/model/legal-entity/register-legal-entity.handler';
import { LegalEntityRepository } from '../core/repositories/legal-entity.repository';

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
                LegalEntityAggregate,
                SensorAggregate,
                LegalEntityRepository,
                SensorRepository,
                EventStorePublisher,
                // organization
                UpdateLegalEntityCommandHandler,
                DeleteLegalEntityCommandHandler,
                RegisterLegalEntityCommandHandler,
                // sensor
                RegisterSensorCommandHandler,
                UpdateSensorCommandHandler,
                DeleteSensorCommandHandler,
                CreateDataStreamCommandHandler,
                DeleteDataStreamCommandHandler,
                // mocked providers
                ...Providers,
            ],
        }).compile();
    };

    const getOrganizationCommandPipeline = async (eventStoreProvider) => {
        const moduleRef = await getModuleRef(eventStoreProvider);
        const commandBus: CommandBus = moduleRef.get(CommandBus);
        const eventPublisher: EventPublisher = moduleRef.get(EventPublisher);
        const organizationAggregate: LegalEntityAggregate = moduleRef.get(LegalEntityAggregate);
        const sensorAggregate: SensorAggregate = moduleRef.get(SensorAggregate);
        const organizationRepository: LegalEntityRepository = moduleRef.get(LegalEntityRepository);
        const sensorRepository: SensorRepository = moduleRef.get(SensorRepository);
        const mergeObjectImpl = (a) => a instanceof LegalEntityAggregate ? organizationAggregate : sensorAggregate;
        jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(mergeObjectImpl);

        return { commandBus, eventPublisher, organizationAggregate, sensorAggregate, organizationRepository, sensorRepository };
    };

    const registerOrganization = async (eventStoreProvider) => {
        const { commandBus, eventPublisher,
            organizationAggregate, organizationRepository } = await getOrganizationCommandPipeline(eventStoreProvider);

        const commandHandler = new RegisterLegalEntityCommandHandler(eventPublisher, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RegisterLegalEntityCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(organizationAggregate, 'onOrganizationRegistered');

        try {
            await commandBus.execute(new RegisterLegalEntityCommand('test-id', 'test-site',
                'test-name', 'test-mail', 'test-phone'));
        } catch {
            Logger.log('Failed to register organization.');
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

        const commandHandler = new UpdateLegalEntityCommandHandler(eventPublisher, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: UpdateLegalEntityCommand) => commandHandler.execute(c));
        const updateFn = jest.spyOn(organizationAggregate, 'onOrganizationUpdated');

        try {
            await commandBus.execute(new UpdateLegalEntityCommand('test-id', 'test-site',
                'test-name', 'test-mail', 'test-phone'));
        } catch {
            Logger.log('Failed to update organization.');
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

        const commandHandler = new DeleteLegalEntityCommandHandler(eventPublisher, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: DeleteLegalEntityCommand) => commandHandler.execute(c));
        const deleteFn = jest.spyOn(organizationAggregate, 'onOrganizationDeleted');

        try {
            await commandBus.execute(new DeleteLegalEntityCommand('test-id'));
        } catch {
            Logger.log('Failed to delete organization');
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

        const commandHandler = new RegisterSensorCommandHandler(eventPublisher, sensorRepository, organizationRepository);
        jest.spyOn(commandBus, 'execute').mockImplementation(async (c: RegisterSensorCommand) => commandHandler.execute(c));
        const registerFn = jest.spyOn(sensorAggregate, 'onSensorRegistered');

        try {
            await commandBus.execute(new RegisterSensorCommand('test-id', 'test-id', 'test-name',
                [0, 0, 0], 'test-base-id',  [], 'test-aim', 'test-description',
                'test-manufacturer', true, undefined, 'test-url', undefined,
                'test-category', 'test-type', undefined));
        } catch {
            Logger.log('Failed to register sensor.');
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
            Logger.log('Failed to update.');
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
            Logger.log('Failed to transfer.');
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
            Logger.log('Failed to share ownership.');
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
