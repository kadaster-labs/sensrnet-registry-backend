import { Aggregate } from '../../event-store/aggregate';
import { SensorState, SensorStateImpl } from './sensor-state';
import { EventMessage } from '../../event-store/event-message';
import { LocationBody } from '../../command/controller/model/location.body';
import { NotAnOwnerException } from '../../command/handler/error/not-an-owner-exception';
import { SensorActiveException } from '../../command/handler/error/sensor-active-exception';
import { CreateDatastreamBody } from '../../command/controller/model/create-datastream.body';
import { SensorInActiveException } from '../../command/handler/error/sensor-inactive-exception';
import { IsAlreadyOwnerException } from '../../command/handler/error/is-already-owner-exception';
import { DatastreamAdded, DatastreamUpdated, DatastreamDeleted, SensorActivated, SensorDeactivated, SensorDeleted,
  SensorOwnershipShared, SensorOwnershipTransferred, SensorRegistered, SensorRelocated, SensorUpdated } from '../events/sensor';

export class SensorAggregate extends Aggregate {
  state!: SensorState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  validateOwner(ownerId: string): void {
    if (!this.state.ownerIds.includes(ownerId)) {
      throw new NotAnOwnerException(ownerId, this.aggregateId);
    }
  }

  register(ownerId: string, name: string, location: LocationBody,
           dataStreams: CreateDatastreamBody[], aim: string, description: string, manufacturer: string,
           active: boolean, observationArea: Record<string, any>, documentationUrl: string, theme: string[],
           typeName: string, typeDetails: Record<string, any>): void {
    this.simpleApply(new SensorRegistered(this.aggregateId, ownerId, name, location.longitude, location.latitude,
        location.height, location.baseObjectId, aim, description, manufacturer, active, observationArea, documentationUrl,
        theme, typeName, typeDetails));

    for (const dataStream of dataStreams) {
      this.addDatastream(ownerId, dataStream.dataStreamId, dataStream.name, dataStream.reason, dataStream.description,
          dataStream.observedProperty, dataStream.unitOfMeasurement, dataStream.isPublic, dataStream.isOpenData,
          dataStream.isReusable, dataStream.documentationUrl, dataStream.dataLink, dataStream.dataFrequency,
          dataStream.dataQuality);
    }
  }

  addDatastream(ownerId: string, dataStreamId: string, name: string, reason: string, description: string, observedProperty: string,
                unitOfMeasurement: string, isPublic: boolean, isOpenData: boolean, isReusable: boolean, documentationUrl: string,
                dataLink: string, dataFrequency: number, dataQuality: number): void {
    this.validateOwner(ownerId);
    this.simpleApply(new DatastreamAdded(this.aggregateId, dataStreamId, name, reason, description, observedProperty,
        unitOfMeasurement, isPublic, isOpenData, isReusable, documentationUrl, dataLink, dataFrequency, dataQuality));
  }

  updateDataStream(ownerId: string, dataStreamId: string, name: string, reason: string, description: string, observedProperty: string,
                   unitOfMeasurement: string, isPublic: boolean, isOpenData: boolean, isReusable: boolean, documentationUrl: string,
                   dataLink: string, dataFrequency: number, dataQuality: number): void {
    this.validateOwner(ownerId);
    this.simpleApply(new DatastreamUpdated(this.aggregateId, dataStreamId, name, reason, description, observedProperty,
        unitOfMeasurement, isPublic, isOpenData, isReusable, documentationUrl, dataLink, dataFrequency, dataQuality));
  }

  deleteDataStream(ownerId: string, dataStreamId: string): void {
    this.validateOwner(ownerId);
    this.simpleApply(new DatastreamDeleted(this.aggregateId, dataStreamId));
  }

  update(ownerId: string, name: string, aim: string, description: string, manufacturer: string,
         observationArea: Record<string, any>, documentationUrl: string, theme: string[],
         typeName: string, typeDetails: Record<string, any>): void {
    this.validateOwner(ownerId);
    this.simpleApply(new SensorUpdated(this.aggregateId, name, aim, description, manufacturer,
        observationArea, documentationUrl, theme, typeName, typeDetails));
  }

  transferOwnership(oldOwnerId: string, newOwnerId: string): void {
    this.validateOwner(oldOwnerId);
    if (this.state.ownerIds.includes(newOwnerId)) {
      throw new IsAlreadyOwnerException(newOwnerId);
    }

    this.simpleApply(new SensorOwnershipTransferred(this.aggregateId, oldOwnerId, newOwnerId));
  }

  shareOwnership(ownerId: string, newOwnerIds: string[]): void {
    this.validateOwner(ownerId);
    for (const newOwnerId of newOwnerIds) {
      if (this.state.ownerIds.includes(newOwnerId)) {
        throw new IsAlreadyOwnerException(newOwnerId);
      }
    }

    this.simpleApply(new SensorOwnershipShared(this.aggregateId, newOwnerIds));
  }

  relocate(ownerId: string, longitude: number, latitude: number, height: number, baseObjectId: string): void {
    this.validateOwner(ownerId);

    this.simpleApply(new SensorRelocated(this.aggregateId, longitude, latitude, height, baseObjectId));
  }

  activate(ownerId: string): void {
    this.validateOwner(ownerId);
    if (this.state.active) {
      throw new SensorActiveException(this.state.id);
    }

    this.simpleApply(new SensorActivated(this.aggregateId));
  }

  deactivate(ownerId: string): void {
    this.validateOwner(ownerId);
    if (!this.state.active) {
      throw new SensorInActiveException(this.state.id);
    }

    this.simpleApply(new SensorDeactivated(this.aggregateId));
  }

  delete(ownerId: string): void {
    this.validateOwner(ownerId);
    this.simpleApply(new SensorDeleted(this.aggregateId));
  }

  onSensorRegistered(eventMessage: EventMessage): void {
    const event: SensorRegistered = eventMessage.data as SensorRegistered;
    const ownerIds = [event.ownerId];
    this.state = new SensorStateImpl(this.aggregateId, event.active, ownerIds);
  }

  onDatastreamAdded(eventMessage: EventMessage): void {
    const event: DatastreamAdded = eventMessage.data as DatastreamAdded;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onDatastreamDeleted(eventMessage: EventMessage): void {
    const event: DatastreamDeleted = eventMessage.data as DatastreamDeleted;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorUpdated(eventMessage: EventMessage): void {
    const event: SensorUpdated = eventMessage.data as SensorUpdated;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorOwnershipTransferred(eventMessage: EventMessage): void {
    const event: SensorOwnershipTransferred = eventMessage.data as SensorOwnershipTransferred;
    this.state.ownerIds = this.state.ownerIds.filter((ownerId) => ownerId !== event.oldOwnerId);
    this.state.ownerIds.push(event.newOwnerId);
  }

  onSensorOwnershipShared(eventMessage: EventMessage): void {
    const event: SensorOwnershipShared = eventMessage.data as SensorOwnershipShared;
    this.state.ownerIds = this.state.ownerIds.concat(event.ownerIds);
  }

  onSensorRelocated(eventMessage: EventMessage): void {
    const event: SensorRelocated = eventMessage.data as SensorRelocated;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorActivated(): void {
    this.state.active = true;
  }

  onSensorDeactivated(): void {
    this.state.active = false;
  }

  onSensorDeleted(eventMessage: EventMessage): void {
    const event: SensorDeleted = eventMessage.data as SensorDeleted;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
