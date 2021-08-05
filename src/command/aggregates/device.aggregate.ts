import { Aggregate } from '../../commons/event-store/aggregate';
import { DeviceState, DeviceStateImpl } from './device-state';
import { EventMessage } from '../../commons/event-store/event-message';
import { Category } from '../api/model/category.body';
import { getSensorAddedEvent, SensorAdded } from '../../commons/events/sensordevice/sensor/added';
import { DeviceLocated, getDeviceLocatedEvent } from '../../commons/events/sensordevice/device/located';
import { DeviceRemoved, getDeviceRemovedEvent } from '../../commons/events/sensordevice/device/removed';
import { DeviceUpdated, getDeviceUpdatedEvent } from '../../commons/events/sensordevice/device/updated';
import { getSensorRemovedEvent, SensorRemoved } from '../../commons/events/sensordevice/sensor/removed';
import { getSensorUpdatedEvent, SensorUpdated } from '../../commons/events/sensordevice/sensor/updated';
import { NotLegalEntityException } from '../handler/error/not-legalentity-exception';
import { UpdateLocationBody } from '../api/model/location/update-location.body';
import { DatastreamAdded, getDatastreamAddedEvent } from '../../commons/events/sensordevice/datastream/added';
import { DeviceRelocated, getDeviceRelocatedEvent } from '../../commons/events/sensordevice/device/relocated';
import { RegisterLocationBody } from '../api/model/location/register-location.body';
import { DeviceRegistered, getDeviceRegisteredEvent } from '../../commons/events/sensordevice/device/registered';
import { DatastreamRemoved, getDatastreamRemovedEvent } from '../../commons/events/sensordevice/datastream/removed';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from '../../commons/events/sensordevice/datastream/updated';
import { getObservationGoalLinkedEvent, ObservationGoalLinked } from '../../commons/events/sensordevice/datastream/observation-goal-linked';
import { ObservationGoalUnlinked } from '../../commons/events/sensordevice/datastream/observation-goal-unlinked/observation-goal-unlinked-v1.event';
import { UnknowObjectException } from '../handler/error/unknow-object-exception';
import { AlreadyExistsException } from '../handler/error/already-exists-exception';

export class DeviceAggregate extends Aggregate {
  state!: DeviceState;

  constructor(
    private readonly aggregateId: string,
  ) {
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

  validateDataStreamId(dataStreamId: string): void {
    if (!this.state.hasDataStream(dataStreamId)) {
      throw new UnknowObjectException(dataStreamId);
    }
  }

  validateObservationGoalId(dataStreamId: string, observationGoalId: string): void {
    if (!this.state.hasObservationGoalId(dataStreamId, observationGoalId)) {
      throw new UnknowObjectException(observationGoalId);
    }
  }

  validateNoObservationGoalId(dataStreamId: string, observationGoalId: string): void {
    if (this.state.hasObservationGoalId(dataStreamId, observationGoalId)) {
      throw new AlreadyExistsException(observationGoalId);
    }
  }

  registerDevice(legalEntityId: string, name: string, description: string, category: Category,
                 connectivity: string, location: RegisterLocationBody): void {
    this.simpleApply(new DeviceRegistered(this.aggregateId, legalEntityId, name, description, category, connectivity));
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

  updateDevice(legalEntityId: string, name: string, description: string, category: Category,
               connectivity: string, location: UpdateLocationBody): void {
    this.validateLegalEntityId(legalEntityId);

    this.simpleApply(new DeviceUpdated(this.aggregateId, legalEntityId, name, description, category, connectivity));
    if (location) {
      this.relocateDevice(legalEntityId, location);
    }
  }

  relocateDevice(legalEntityId: string, location: UpdateLocationBody): void {
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
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  addSensor(sensorId: string, legalEntityId: string, name: string, description: string,
            type: string, manufacturer: string, supplier: string, documentation: string): void {
    this.validateLegalEntityId(legalEntityId);

    this.simpleApply(new SensorAdded(this.aggregateId, sensorId, legalEntityId, name, description,
        type, manufacturer, supplier, documentation));
  }

  onSensorAdded(eventMessage: EventMessage): void {
    const event: SensorAdded = getSensorAddedEvent(eventMessage);
    this.state.addSensor(event.sensorId);
  }

  updateSensor(sensorId: string, legalEntityId: string, name: string, description: string,
               type: string, manufacturer: string, supplier: string, documentation: string): void {
    this.validateLegalEntityId(legalEntityId);
    this.validateSensorId(sensorId);

    this.simpleApply(new SensorUpdated(this.aggregateId, sensorId, legalEntityId, name, description,
        type, manufacturer, supplier, documentation));
  }

  onSensorUpdated(eventMessage: EventMessage): void {
    const event: SensorUpdated = getSensorUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
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

  addDataStream(sensorId: string, legalEntityId: string, dataStreamId: string, name: string,
                description: string, unitOfMeasurement: Record<string, any>, observationArea: Record<string, any>,
                theme: string[], dataQuality: string, isActive: boolean, isPublic: boolean, isOpenData: boolean,
                containsPersonalInfoData: boolean, isReusable: boolean, documentation: string, dataLink: string): void {
    this.validateLegalEntityId(legalEntityId);
    this.validateSensorId(sensorId);

    this.simpleApply(new DatastreamAdded(this.aggregateId, sensorId, legalEntityId, dataStreamId, name,
        description, unitOfMeasurement, observationArea, theme, dataQuality, isActive, isPublic, isOpenData,
        containsPersonalInfoData, isReusable, documentation, dataLink));
  }

  onDatastreamAdded(eventMessage: EventMessage): void {
    const event: DatastreamAdded = getDatastreamAddedEvent(eventMessage);
    this.state.addDataStream(event.dataStreamId);
  }

  updateDataStream(sensorId: string, legalEntityId: string, dataStreamId: string, name: string,
                   description: string, unitOfMeasurement: Record<string, any>, observationArea: Record<string, any>,
                   theme: string[], dataQuality: string, isActive: boolean, isPublic: boolean, isOpenData: boolean,
                   containsPersonalInfoData: boolean, isReusable: boolean, documentation: string, dataLink: string): void {
    this.validateLegalEntityId(legalEntityId);
    this.validateSensorId(sensorId);
    this.validateDataStreamId(dataStreamId);

    this.simpleApply(new DatastreamUpdated(this.aggregateId, sensorId, legalEntityId, dataStreamId, name,
        description, unitOfMeasurement, observationArea, theme, dataQuality, isActive, isPublic, isOpenData,
        containsPersonalInfoData, isReusable, documentation, dataLink));
  }

  onDatastreamUpdated(eventMessage: EventMessage): void {
    const event: DatastreamUpdated = getDatastreamUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  linkObservationGoal(sensorId: string, legalEntityId: string, dataStreamId: string, observationGoalId: string): void {
    this.validateLegalEntityId(legalEntityId);
    this.validateSensorId(sensorId);
    this.validateDataStreamId(dataStreamId);
    this.validateNoObservationGoalId(dataStreamId, observationGoalId);

    this.simpleApply(new ObservationGoalLinked(this.aggregateId, sensorId, legalEntityId, dataStreamId, observationGoalId));
  }

  onObservationGoalLinked(eventMessage: EventMessage): void {
    const event: ObservationGoalLinked = getObservationGoalLinkedEvent(eventMessage);
    this.state.addObservationGoalId(event.dataStreamId, event.observationGoalId);
  }

  unlinkObservationGoal(sensorId: string, legalEntityId: string, dataStreamId: string, observationGoalId: string): void {
    this.validateLegalEntityId(legalEntityId);
    this.validateSensorId(sensorId);
    this.validateDataStreamId(dataStreamId);
    this.validateObservationGoalId(dataStreamId, observationGoalId);

    this.simpleApply(new ObservationGoalUnlinked(this.aggregateId, sensorId, legalEntityId, dataStreamId, observationGoalId));
  }

  onObservationGoalUnlinked(eventMessage: EventMessage): void {
    const event: ObservationGoalLinked = getObservationGoalLinkedEvent(eventMessage);
    this.state.removeObservationGoalId(event.dataStreamId, event.observationGoalId);
  }

  removeDataStream(sensorId: string, legalEntityId: string, dataStreamId: string): void {
    this.validateLegalEntityId(legalEntityId);
    this.validateSensorId(sensorId);
    this.validateDataStreamId(dataStreamId);

    this.simpleApply(new DatastreamRemoved(this.aggregateId, sensorId, legalEntityId, dataStreamId));
  }

  onDatastreamRemoved(eventMessage: EventMessage): void {
    const event: DatastreamRemoved = getDatastreamRemovedEvent(eventMessage);
    this.state.removeDataStream(event.dataStreamId);
  }
}
