import { Aggregate } from '../../commons/event-store/aggregate';
import { EventMessage } from '../../commons/event-store/event-message';
import { DatastreamAdded, getDatastreamAddedEvent } from '../../commons/events/sensordevice/datastream/added';
import {
    getObservationGoalLinkedEvent,
    ObservationGoalLinked,
} from '../../commons/events/sensordevice/datastream/observation-goal-linked';
import { ObservationGoalUnlinked } from '../../commons/events/sensordevice/datastream/observation-goal-unlinked/observation-goal-unlinked-v1.event';
import { DatastreamRemoved, getDatastreamRemovedEvent } from '../../commons/events/sensordevice/datastream/removed';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from '../../commons/events/sensordevice/datastream/updated';
import { DeviceLocated, getDeviceLocatedEvent } from '../../commons/events/sensordevice/device/located';
import { DeviceRegistered, getDeviceRegisteredEvent } from '../../commons/events/sensordevice/device/registered';
import { DeviceRelocated, getDeviceRelocatedEvent } from '../../commons/events/sensordevice/device/relocated';
import { DeviceRemoved, getDeviceRemovedEvent } from '../../commons/events/sensordevice/device/removed';
import { DeviceUpdated, getDeviceUpdatedEvent } from '../../commons/events/sensordevice/device/updated';
import { getSensorAddedEvent, SensorAdded } from '../../commons/events/sensordevice/sensor/added';
import { getSensorRemovedEvent, SensorRemoved } from '../../commons/events/sensordevice/sensor/removed';
import { getSensorUpdatedEvent, SensorUpdated } from '../../commons/events/sensordevice/sensor/updated';
import { AlreadyExistsException } from '../handler/error/already-exists-exception';
import { NotLegalEntityException } from '../handler/error/not-legalentity-exception';
import { UnknowObjectException } from '../handler/error/unknow-object-exception';
import Location from '../interfaces/location.interface';
import { Category } from '../model/category.model';
import { DeviceState, DeviceStateImpl } from './device-state';

export class DeviceAggregate extends Aggregate {
    state!: DeviceState;

    constructor(private readonly aggregateId: string) {
        super();
    }

    validateLegalEntityId(legalEntityId: string): void {
        if (this.state.legalEntityId !== legalEntityId) {
            throw new NotLegalEntityException(this.aggregateId);
        }
    }

    validateSensorId(sensorId: string): void {
        if (!this.state.hasSensor(sensorId)) {
            throw new UnknowObjectException(sensorId);
        }
    }

    validateDatastreamId(datastreamId: string): void {
        if (!this.state.hasDatastream(datastreamId)) {
            throw new UnknowObjectException(datastreamId);
        }
    }

    validateObservationGoalId(datastreamId: string, observationGoalId: string): void {
        if (!this.state.hasObservationGoalId(datastreamId, observationGoalId)) {
            throw new UnknowObjectException(observationGoalId);
        }
    }

    validateNoObservationGoalId(datastreamId: string, observationGoalId: string): void {
        if (this.state.hasObservationGoalId(datastreamId, observationGoalId)) {
            throw new AlreadyExistsException(observationGoalId);
        }
    }

    registerDevice(
        legalEntityId: string,
        name: string,
        description: string,
        category: Category,
        connectivity: string,
        location: Location,
    ): void {
        this.simpleApply(
            new DeviceRegistered(this.aggregateId, legalEntityId, name, description, category, connectivity),
        );
        this.simpleApply(new DeviceLocated(this.aggregateId, location.name, location.description, location.location));
    }

    onDeviceRegistered(eventMessage: EventMessage): void {
        const event: DeviceRegistered = getDeviceRegisteredEvent(eventMessage);
        this.state = new DeviceStateImpl(this.aggregateId, event.legalEntityId);
    }

    onDeviceLocated(eventMessage: EventMessage): void {
        const event: DeviceLocated = getDeviceLocatedEvent(eventMessage);
        this.state.location = event.location;
    }

    updateDevice(
        legalEntityId: string,
        name: string,
        description: string,
        category: Category,
        connectivity: string,
        location: Location,
    ): void {
        this.validateLegalEntityId(legalEntityId);

        this.simpleApply(new DeviceUpdated(this.aggregateId, legalEntityId, name, description, category, connectivity));
        if (location) {
            this.relocateDevice(legalEntityId, location);
        }
    }

    relocateDevice(legalEntityId: string, location: Location): void {
        this.validateLegalEntityId(legalEntityId);

        this.simpleApply(new DeviceRelocated(this.aggregateId, location.name, location.description, location.location));
    }

    onDeviceUpdated(eventMessage: EventMessage): void {
        getDeviceUpdatedEvent(eventMessage);
    }

    onDeviceRelocated(eventMessage: EventMessage): void {
        const event: DeviceRelocated = getDeviceRelocatedEvent(eventMessage);
        this.state.location = event.location;
    }

    removeDevice(legalEntityId: string): void {
        this.validateLegalEntityId(legalEntityId);

        this.simpleApply(new DeviceRemoved(this.aggregateId, legalEntityId));
    }

    onDeviceRemoved(eventMessage: EventMessage): void {
        const event: DeviceRemoved = getDeviceRemovedEvent(eventMessage);
        this.logUnusedInAggregate(event);
    }

    addSensor(
        sensorId: string,
        legalEntityId: string,
        name: string,
        description: string,
        type: string,
        manufacturer: string,
        supplier: string,
        documentation: string,
    ): void {
        this.validateLegalEntityId(legalEntityId);

        this.simpleApply(
            new SensorAdded(
                this.aggregateId,
                sensorId,
                legalEntityId,
                name,
                description,
                type,
                manufacturer,
                supplier,
                documentation,
            ),
        );
    }

    onSensorAdded(eventMessage: EventMessage): void {
        const event: SensorAdded = getSensorAddedEvent(eventMessage);
        this.state.addSensor(event.sensorId);
    }

    updateSensor(
        sensorId: string,
        legalEntityId: string,
        name: string,
        description: string,
        type: string,
        manufacturer: string,
        supplier: string,
        documentation: string,
    ): void {
        this.validateLegalEntityId(legalEntityId);
        this.validateSensorId(sensorId);

        this.simpleApply(
            new SensorUpdated(
                this.aggregateId,
                sensorId,
                legalEntityId,
                name,
                description,
                type,
                manufacturer,
                supplier,
                documentation,
            ),
        );
    }

    onSensorUpdated(eventMessage: EventMessage): void {
        const event: SensorUpdated = getSensorUpdatedEvent(eventMessage);
        this.logUnusedInAggregate(event);
    }

    removeSensor(sensorId: string, legalEntityId: string): void {
        this.validateLegalEntityId(legalEntityId);
        this.validateSensorId(sensorId);

        this.simpleApply(new SensorRemoved(this.aggregateId, sensorId, legalEntityId));
    }

    onSensorRemoved(eventMessage: EventMessage): void {
        const event: SensorRemoved = getSensorRemovedEvent(eventMessage);
        this.state.removeSensor(event.sensorId);
    }

    addDatastream(
        sensorId: string,
        legalEntityId: string,
        datastreamId: string,
        name: string,
        description: string,
        unitOfMeasurement: Record<string, any>,
        observationArea: Record<string, any>,
        theme: string[],
        dataQuality: string,
        isActive: boolean,
        isPublic: boolean,
        isOpenData: boolean,
        containsPersonalInfoData: boolean,
        isReusable: boolean,
        documentation: string,
        dataLink: string,
    ): void {
        this.validateLegalEntityId(legalEntityId);
        this.validateSensorId(sensorId);

        this.simpleApply(
            new DatastreamAdded(
                this.aggregateId,
                sensorId,
                legalEntityId,
                datastreamId,
                name,
                description,
                unitOfMeasurement,
                observationArea,
                theme,
                dataQuality,
                isActive,
                isPublic,
                isOpenData,
                containsPersonalInfoData,
                isReusable,
                documentation,
                dataLink,
            ),
        );
    }

    onDatastreamAdded(eventMessage: EventMessage): void {
        const event: DatastreamAdded = getDatastreamAddedEvent(eventMessage);
        this.state.addDatastream(event.datastreamId);
    }

    updateDatastream(
        sensorId: string,
        legalEntityId: string,
        datastreamId: string,
        name: string,
        description: string,
        unitOfMeasurement: Record<string, any>,
        observationArea: Record<string, any>,
        theme: string[],
        dataQuality: string,
        isActive: boolean,
        isPublic: boolean,
        isOpenData: boolean,
        containsPersonalInfoData: boolean,
        isReusable: boolean,
        documentation: string,
        dataLink: string,
    ): void {
        this.validateLegalEntityId(legalEntityId);
        this.validateSensorId(sensorId);
        this.validateDatastreamId(datastreamId);

        this.simpleApply(
            new DatastreamUpdated(
                this.aggregateId,
                sensorId,
                legalEntityId,
                datastreamId,
                name,
                description,
                unitOfMeasurement,
                observationArea,
                theme,
                dataQuality,
                isActive,
                isPublic,
                isOpenData,
                containsPersonalInfoData,
                isReusable,
                documentation,
                dataLink,
            ),
        );
    }

    onDatastreamUpdated(eventMessage: EventMessage): void {
        const event: DatastreamUpdated = getDatastreamUpdatedEvent(eventMessage);
        this.logUnusedInAggregate(event);
    }

    linkObservationGoal(
        sensorId: string,
        legalEntityId: string,
        datastreamId: string,
        observationGoalId: string,
    ): void {
        this.validateLegalEntityId(legalEntityId);
        this.validateSensorId(sensorId);
        this.validateDatastreamId(datastreamId);
        this.validateNoObservationGoalId(datastreamId, observationGoalId);

        this.simpleApply(
            new ObservationGoalLinked(this.aggregateId, sensorId, legalEntityId, datastreamId, observationGoalId),
        );
    }

    onObservationGoalLinked(eventMessage: EventMessage): void {
        const event: ObservationGoalLinked = getObservationGoalLinkedEvent(eventMessage);
        this.state.addObservationGoalId(event.datastreamId, event.observationGoalId);
    }

    unlinkObservationGoal(
        sensorId: string,
        legalEntityId: string,
        datastreamId: string,
        observationGoalId: string,
    ): void {
        this.validateLegalEntityId(legalEntityId);
        this.validateSensorId(sensorId);
        this.validateDatastreamId(datastreamId);
        this.validateObservationGoalId(datastreamId, observationGoalId);

        this.simpleApply(
            new ObservationGoalUnlinked(this.aggregateId, sensorId, legalEntityId, datastreamId, observationGoalId),
        );
    }

    onObservationGoalUnlinked(eventMessage: EventMessage): void {
        const event: ObservationGoalLinked = getObservationGoalLinkedEvent(eventMessage);
        this.state.removeObservationGoalId(event.datastreamId, event.observationGoalId);
    }

    removeDatastream(sensorId: string, legalEntityId: string, datastreamId: string): void {
        this.validateLegalEntityId(legalEntityId);
        this.validateSensorId(sensorId);
        this.validateDatastreamId(datastreamId);

        this.simpleApply(new DatastreamRemoved(this.aggregateId, sensorId, legalEntityId, datastreamId));
    }

    onDatastreamRemoved(eventMessage: EventMessage): void {
        const event: DatastreamRemoved = getDatastreamRemovedEvent(eventMessage);
        this.state.removeDatastream(event.datastreamId);
    }
}
