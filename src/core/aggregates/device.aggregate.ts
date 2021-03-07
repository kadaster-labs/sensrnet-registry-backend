import { Category } from '../../command/controller/model/category.body';
import { RegisterLocationBody } from '../../command/controller/model/location/register-location.body';
import { UpdateLocationBody } from '../../command/controller/model/location/update-location.body';
import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { getObservationGoalAddedEvent, ObservationGoalAdded } from '../events/observation-goal/added';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from '../events/observation-goal/removed';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from '../events/observation-goal/updated';
import { DatastreamAdded, getDatastreamAddedEvent } from '../events/sensordevice/datastream/added';
import { DatastreamRemoved, getDatastreamRemovedEvent } from '../events/sensordevice/datastream/removed';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from '../events/sensordevice/datastream/updated';
import { DeviceLocated, getDeviceLocatedEvent } from '../events/sensordevice/device/located';
import { DeviceRegistered, getDeviceRegisteredEvent } from '../events/sensordevice/device/registered';
import { DeviceRelocated, getDeviceRelocatedEvent } from '../events/sensordevice/device/relocated';
import { DeviceRemoved, getDeviceRemovedEvent } from '../events/sensordevice/device/removed';
import { DeviceUpdated, getDeviceUpdatedEvent } from '../events/sensordevice/device/updated';
import { getSensorAddedEvent, SensorAdded } from '../events/sensordevice/sensor/added';
import { getSensorRemovedEvent, SensorRemoved } from '../events/sensordevice/sensor/removed';
import { getSensorUpdatedEvent, SensorUpdated } from '../events/sensordevice/sensor/updated';
import { DeviceState, DeviceStateImpl } from './device-state';

export class DeviceAggregate extends Aggregate {

  state!: DeviceState;

  constructor(
    private readonly aggregateId: string,
  ) {
    super();
  }

  registerDevice(legalEntityId: string, name: string, description: string, category: Category,
                 connectivity: string, location: RegisterLocationBody): void {
    this.simpleApply(new DeviceRegistered(this.aggregateId, legalEntityId, name, description,
      category, connectivity));
    this.simpleApply(new DeviceLocated(this.aggregateId, location.name, location.description, location.location));
  }

  onDeviceRegistered(eventMessage: EventMessage): void {
    const event: DeviceRegistered = getDeviceRegisteredEvent(eventMessage);
    // TODO remove method?
  }

  onDeviceLocated(eventMessage: EventMessage): void {
    const event: DeviceLocated = getDeviceLocatedEvent(eventMessage);
    this.state = new DeviceStateImpl(this.aggregateId, event.location);
  }

  updateDevice(legalEntityId: string, name: string, description: string,
               category: Category, connectivity: string, location: UpdateLocationBody): void {
    this.simpleApply(new DeviceUpdated(this.aggregateId, legalEntityId, name, description,
      category, connectivity));
    this.simpleApply(new DeviceRelocated(this.aggregateId, location.name, location.description, location.location));
  }

  onDeviceUpdated(eventMessage: EventMessage): void {
    const event: DeviceUpdated = getDeviceUpdatedEvent(eventMessage);
    // TODO remove method?
  }

  onDeviceRelocated(eventMessage: EventMessage): void {
    const event: DeviceRelocated = getDeviceRelocatedEvent(eventMessage);
    this.state.location = event.location;
  }

  removeDevice(legalEntityId: string): void {
    this.simpleApply(new DeviceRemoved(this.aggregateId, legalEntityId));
  }

  onDeviceRemoved(eventMessage: EventMessage): void {
    const event: DeviceRemoved = getDeviceRemovedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  addSensor(sensorId: string, legalEntityId: string, name: string, description: string,
            type: string, manufacturer: string, supplier: string, documentation: string): void {
    this.simpleApply(new SensorAdded(this.aggregateId, sensorId, legalEntityId, name, description,
      type, manufacturer, supplier, documentation));
  }

  onSensorAdded(eventMessage: EventMessage): void {
    const event: SensorAdded = getSensorAddedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  updateSensor(sensorId: string, legalEntityId: string, name: string, description: string,
               type: string, manufacturer: string, supplier: string, documentation: string): void {
    this.simpleApply(new SensorUpdated(this.aggregateId, sensorId, legalEntityId, name, description,
      type, manufacturer, supplier, documentation));
  }

  onSensorUpdated(eventMessage: EventMessage): void {
    const event: SensorUpdated = getSensorUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  removeSensor(sensorId: string, legalEntityId: string): void {
    this.simpleApply(new SensorRemoved(this.aggregateId, sensorId, legalEntityId));
  }

  onSensorRemoved(eventMessage: EventMessage): void {
    const event: SensorRemoved = getSensorRemovedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  addDataStream(sensorId: string, legalEntityId: string, dataStreamId: string, name: string,
                description: string, unitOfMeasurement: Record<string, any>, observationArea: Record<string, any>,
                theme: string[], dataQuality: string, isActive: boolean, isPublic: boolean, isOpenData: boolean,
                containsPersonalInfoData: boolean, isReusable: boolean, documentation: string, dataLink: string): void {
    this.simpleApply(new DatastreamAdded(this.aggregateId, sensorId, legalEntityId, dataStreamId, name,
      description, unitOfMeasurement, observationArea, theme, dataQuality, isActive, isPublic, isOpenData,
      containsPersonalInfoData, isReusable, documentation, dataLink));
  }

  onDatastreamAdded(eventMessage: EventMessage): void {
    const event: DatastreamAdded = getDatastreamAddedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  updateDataStream(sensorId: string, legalEntityId: string, dataStreamId: string, name: string,
                   description: string, unitOfMeasurement: Record<string, any>, observationArea: Record<string, any>,
                   theme: string[], dataQuality: string, isActive: boolean, isPublic: boolean, isOpenData: boolean,
                   containsPersonalInfoData: boolean, isReusable: boolean, documentation: string, dataLink: string): void {
    this.simpleApply(new DatastreamUpdated(this.aggregateId, sensorId, legalEntityId, dataStreamId, name,
      description, unitOfMeasurement, observationArea, theme, dataQuality, isActive, isPublic, isOpenData,
      containsPersonalInfoData, isReusable, documentation, dataLink));
  }

  onDatastreamUpdated(eventMessage: EventMessage): void {
    const event: DatastreamUpdated = getDatastreamUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  removeDataStream(sensorId: string, legalEntityId: string, dataStreamId: string): void {
    this.simpleApply(new DatastreamRemoved(this.aggregateId, sensorId, legalEntityId, dataStreamId));
  }

  onDatastreamRemoved(eventMessage: EventMessage): void {
    const event: DatastreamRemoved = getDatastreamRemovedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  addObservationGoal(dataStreamId: string, observationGoalId: string, legalEntityId: string, name: string,
                     description: string, legalGround: string, legalGroundLink: string): void {
    this.simpleApply(new ObservationGoalAdded(this.aggregateId, dataStreamId, observationGoalId, legalEntityId,
      name, description, legalGround, legalGroundLink));
  }

  onObservationGoalAdded(eventMessage: EventMessage): void {
    const event: ObservationGoalAdded = getObservationGoalAddedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  updateObservationGoal(dataStreamId: string, observationGoalId: string, legalEntityId: string, name: string,
                        description: string, legalGround: string, legalGroundLink: string): void {
    this.simpleApply(new ObservationGoalUpdated(this.aggregateId, dataStreamId, observationGoalId, legalEntityId,
      name, description, legalGround, legalGroundLink));
  }

  onObservationGoalUpdated(eventMessage: EventMessage): void {
    const event: ObservationGoalUpdated = getObservationGoalUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  removeObservationGoal(dataStreamId: string, observationGoalId: string, legalEntityId: string): void {
    this.simpleApply(new ObservationGoalRemoved(this.aggregateId, dataStreamId, observationGoalId, legalEntityId));
  }

  onObservationGoalRemoved(eventMessage: EventMessage): void {
    const event: ObservationGoalRemoved = getObservationGoalRemovedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
