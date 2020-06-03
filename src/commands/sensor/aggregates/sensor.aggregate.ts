import {
  DatastreamAdded,
  DatastreamDeleted,
  SensorActivated,
  SensorDeactivated,
  SensorDeleted,
  SensorOwnershipShared,
  SensorOwnershipTransferred,
  SensorRegistered,
  SensorRelocated,
  SensorUpdated,
} from '../../../events/sensor';
import {LocationBody} from '../models/bodies/location-body';
import {DataStreamBody} from '../models/bodies/datastream-body';
import {SensorActiveException, SensorInActiveException} from '../errors/sensor-active-exception';
import {Aggregate} from '../../../event-store/aggregate';
import {SensorState, SensorStateImpl} from './sensor-state';
import {EventMessage} from '../../../event-store/event-message';

export class SensorAggregate extends Aggregate {
  state!: SensorState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  register(nodeId: string, ownerIds: string[], name: string, location: LocationBody,
           dataStreams: DataStreamBody[], aim: string, description: string, manufacturer: string,
           active: boolean, observationArea: object, documentationUrl: string, theme: string[],
           typeName: string, typeDetails: object) {
    this.simpleApply(new SensorRegistered(this.aggregateId, nodeId, ownerIds, name, location.x, location.y, location.z, location.epsgCode,
        location.baseObjectId, aim, description, manufacturer, active, observationArea, documentationUrl,
        theme, typeName, typeDetails));

    for (const dataStream of dataStreams) {
      this.addDatastream(dataStream.dataStreamId, dataStream.name, dataStream.reason, dataStream.description,
          dataStream.observedProperty, dataStream.unitOfMeasurement, dataStream.isPublic, dataStream.isOpenData,
          dataStream.isReusable, dataStream.documentationUrl, dataStream.dataLink, dataStream.dataFrequency,
          dataStream.dataQuality);
    }
  }

  addDatastream(dataStreamId: string, name: string, reason: string, description: string, observedProperty: string,
                unitOfMeasurement: string, isPublic: boolean, isOpenData: boolean, isReusable: boolean, documentationUrl: string,
                dataLink: string, dataFrequency: number, dataQuality: number) {
    this.simpleApply(new DatastreamAdded(this.aggregateId, dataStreamId, name, reason, description, observedProperty,
        unitOfMeasurement, isPublic, isOpenData, isReusable, documentationUrl, dataLink, dataFrequency, dataQuality));
  }

  deleteDataStream(dataStreamId: string) {
    this.simpleApply(new DatastreamDeleted(this.aggregateId, dataStreamId));
  }

  update(name: string, aim: string, description: string, manufacturer: string,
         observationArea: object, documentationUrl: string, theme: string[],
         typeName: string, typeDetails: object) {
    this.simpleApply(new SensorUpdated(this.aggregateId, name, aim, description, manufacturer,
        observationArea, documentationUrl, theme, typeName, typeDetails));
  }

  transferOwnership(oldOwnerId: string, newOwnerId: string) {
    this.simpleApply(new SensorOwnershipTransferred(this.aggregateId, oldOwnerId, newOwnerId));
  }

  shareOwnership(ownerIds: string[]) {
    this.simpleApply(new SensorOwnershipShared(this.aggregateId, ownerIds));
  }

  relocate(x: number, y: number, z: number, epsgCode: number, baseObjectId: string) {
    this.simpleApply(new SensorRelocated(this.aggregateId, x, y, z, epsgCode, baseObjectId));
  }

  activate() {
    if (this.state.active) {
      throw new SensorActiveException(this.state.id);
    }

    this.simpleApply(new SensorActivated(this.aggregateId));
  }

  deactivate() {
    if (!this.state.active) {
      throw new SensorInActiveException(this.state.id);
    }

    this.simpleApply(new SensorDeactivated(this.aggregateId));
  }

  delete() {
    this.simpleApply(new SensorDeleted(this.aggregateId));
  }

  private onSensorRegistered(eventMessage: EventMessage) {
    const event: SensorRegistered = eventMessage.data as SensorRegistered;
    this.state = new SensorStateImpl(this.aggregateId);

    this.state.actives.push(event.active);
  }

  private onDatastreamAdded(eventMessage: EventMessage) {
    const event: DatastreamAdded = eventMessage.data as DatastreamAdded;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onDatastreamDeleted(eventMessage: EventMessage) {
    const event: DatastreamDeleted = eventMessage.data as DatastreamDeleted;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorUpdated(eventMessage: EventMessage) {
    const event: SensorUpdated = eventMessage.data as SensorUpdated;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorOwnershipTransferred(eventMessage: EventMessage) {
    const event: SensorOwnershipTransferred = eventMessage.data as SensorOwnershipTransferred;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorOwnershipShared(eventMessage: EventMessage) {
    const event: SensorOwnershipShared = eventMessage.data as SensorOwnershipShared;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorRelocated(eventMessage: EventMessage) {
    const event: SensorRelocated = eventMessage.data as SensorRelocated;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorActivated(eventMessage: EventMessage) {
    const event: SensorActivated = eventMessage.data as SensorActivated;
    this.state.actives.push(true);
  }

  private onSensorDeactivated(eventMessage: EventMessage) {
    const event: SensorDeactivated = eventMessage.data as SensorDeactivated;
    this.state.actives.push(false);
  }

  private onSensorDeleted(eventMessage: EventMessage) {
    const event: SensorDeleted = eventMessage.data as SensorDeleted;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

}
