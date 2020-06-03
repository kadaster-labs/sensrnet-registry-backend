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
import {Logger} from '@nestjs/common';
import {SensorState, SensorStateImpl} from './sensor-state';

export class SensorAggregate extends Aggregate {
  state!: SensorState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  register(nodeId: string, ownerIds: string[], name: string, location: LocationBody,
           dataStreams: DataStreamBody[], aim: string, description: string, manufacturer: string,
           active: boolean, observationArea: object, documentationUrl: string, theme: string[],
           typeName: string, typeDetails: object) {
    this.simpleApply(new SensorRegistered(this.aggregateId, nodeId, ownerIds, name, location.longitude, location.latitude,
        location.height, location.baseObjectId, aim, description, manufacturer, active, observationArea, documentationUrl,
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

  relocate(longitude: number, latitude: number, height: number, baseObjectId: string) {
    this.simpleApply(new SensorRelocated(this.aggregateId, longitude, latitude, height, baseObjectId));
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

  private onSensorRegistered(event: SensorRegistered) {
    this.state = new SensorStateImpl(this.aggregateId);

    this.state.actives.push(event.active);
  }

  private onDatastreamAdded(event: DatastreamAdded) {
    Logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onDatastreamDeleted(event: DatastreamDeleted) {
    Logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorUpdated(event: SensorUpdated) {
    Logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorOwnershipTransferred(event: SensorOwnershipTransferred) {
    Logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorOwnershipShared(event: SensorOwnershipShared) {
    Logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorRelocated(event: SensorRelocated) {
    Logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onSensorActivated(event: SensorActivated) {
    this.state.actives.push(true);
  }

  private onSensorDeactivated(event: SensorDeactivated) {
    this.state.actives.push(false);
  }

  private onSensorDeleted(event: SensorDeleted) {
    Logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

}
