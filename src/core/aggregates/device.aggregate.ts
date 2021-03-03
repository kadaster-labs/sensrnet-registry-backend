import { Aggregate } from '../../event-store/aggregate';
import { DeviceState, DeviceStateImpl } from './device-state';
import { EventMessage } from '../../event-store/event-message';
import { getSensorRemovedEvent, SensorRemoved } from '../events/sensor/removed';
import { getSensorUpdatedEvent, SensorUpdated } from '../events/sensor/updated';
import { DatastreamAdded, getDatastreamAddedEvent } from '../events/data-stream/added';
import { getSensorAddedEvent, SensorAdded } from '../events/sensor/added';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from '../events/data-stream/updated';
import { DatastreamRemoved, getDatastreamRemovedEvent } from '../events/data-stream/removed';
import { Category } from '../../command/controller/model/category.body';
import { DeviceUpdated, getDeviceUpdatedEvent } from '../events/device/updated';
import { DeviceRemoved, getDeviceRemovedEvent } from '../events/device/removed';
import { DeviceRegistered, getDeviceRegisteredEvent } from '../events/device/registered';
import { UpdateLocationBody } from '../../command/controller/model/location/update-location.body';
import { RegisterLocationBody } from '../../command/controller/model/location/register-location.body';
import { getObservationGoalAddedEvent, ObservationGoalAdded } from '../events/observation-goal/added';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from '../events/observation-goal/updated';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from '../events/observation-goal/removed';

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
        category, connectivity, location));
  }

  onDeviceRegistered(eventMessage: EventMessage): void {
    const event: DeviceRegistered = getDeviceRegisteredEvent(eventMessage);
    this.state = new DeviceStateImpl(this.aggregateId, event.location.location);
  }

  updateDevice(legalEntityId: string, name: string, description: string,
               category: Category, connectivity: string, location: UpdateLocationBody): void {
    this.simpleApply(new DeviceUpdated(this.aggregateId, legalEntityId, name, description,
        category, connectivity, location));
  }

  onDeviceUpdated(eventMessage: EventMessage): void {
    const event: DeviceUpdated = getDeviceUpdatedEvent(eventMessage);
    if (event.location && event.location.location) {
      this.state.location = event.location.location;
    }
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
