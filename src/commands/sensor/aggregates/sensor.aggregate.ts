import { AggregateRoot } from "@nestjs/cqrs";
import { SensorUpdated } from "../../../events/sensor/events/updated.event";
import { SensorDeleted } from "../../../events/sensor/events/deleted.event";
import { SensorActivated } from "../../../events/sensor/events/activated.event";
import { SensorRegistered } from "../../../events/sensor/events/registered.event";
import { SensorDeactivated } from "../../../events/sensor/events/deactivated.event";
import { isValidEvent } from "../../../event-store/event-utils";
import { LocationBody } from "../models/bodies/location-body";
import { SensorOwnershipShared } from "../../../events/sensor/events/ownershipshared.event";
import { DataStreamBody } from "../models/bodies/datastream-body";
import { SensorRelocated } from "../../../events/sensor/events/relocated.event";
import { DatastreamAdded } from "../../../events/sensor/events/datastreamadded.event";
import { DatastreamDeleted } from "../../../events/sensor/events/datastreamdeleted.event";
import { SensorActiveException, SensorInActiveException } from "../errors/sensor-active-exception";
import { SensorOwnershipTransferred } from "../../../events/sensor/events/ownershiptransferred.event";


export class SensorAggregate extends AggregateRoot {
  state!: SensorState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  register(nodeId: string, ownerIds: Array<string>, name: string, location: LocationBody,
    dataStreams: Array<DataStreamBody>, aim: string, description: string, manufacturer: string,
    active: boolean, observationArea: object, documentationUrl: string, theme: Array<string>,
    typeName: string, typeDetails: object) {
    this.apply(new SensorRegistered(this.aggregateId, nodeId, ownerIds, name, location,
      aim, description, manufacturer, active, observationArea, documentationUrl,
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
    this.apply(new DatastreamAdded(this.aggregateId, dataStreamId, name, reason, description, observedProperty,
      unitOfMeasurement, isPublic, isOpenData, isReusable, documentationUrl, dataLink, dataFrequency, dataQuality));
  }

  deleteDataStream(dataStreamId: string) {
    this.apply(new DatastreamDeleted(this.aggregateId, dataStreamId));
  }

  update(name: string, aim: string, description: string, manufacturer: string,
    observationArea: object, documentationUrl: string, theme: Array<string>,
    typeName: string, typeDetails: object) {
    this.apply(new SensorUpdated(this.aggregateId, name, aim, description, manufacturer,
      observationArea, documentationUrl, theme, typeName, typeDetails));
  }

  transferOwnership(oldOwnerId: string, newOwnerId: string) {
    this.apply(new SensorOwnershipTransferred(this.aggregateId, oldOwnerId, newOwnerId));
  }

  shareOwnership(ownerIds: Array<string>) {
    this.apply(new SensorOwnershipShared(this.aggregateId, ownerIds));
  }

  relocate(x: number, y: number, z: number, epsgCode: number, baseObjectId: string) {
    this.apply(new SensorRelocated(this.aggregateId, x, y, z, epsgCode, baseObjectId));
  }

  activate() {
    if (this.state.active) throw new SensorActiveException(this.state.id);

    this.apply(new SensorActivated(this.aggregateId));
  }

  deactivate() {
    if (!this.state.active) throw new SensorInActiveException(this.state.id);

    this.apply(new SensorDeactivated(this.aggregateId));
  }

  delete() {
    this.apply(new SensorDeleted(this.aggregateId));
  }

  private onSensorCreated(event: SensorRegistered) {
    this.state = new SensorStateImpl(this.aggregateId);

    this.state.actives.push(event.data["active"]);
  }

  private onDataStreamCreated(event: DatastreamAdded) {
  }

  private onDataStreamDeleted(event: DatastreamDeleted) {
  }

  private onUpdated(event: SensorUpdated) {
  }

  private onOwnershipTransferred(event: SensorOwnershipTransferred) {
  }

  private onOwnershipShared(event: SensorOwnershipShared) {
  }

  private onLocationUpdated(event: SensorRelocated) {
  }

  private onActivated(event: SensorActivated) {
    this.state.actives.push(true);
  }

  private onDeactivated(event: SensorDeactivated) {
    this.state.actives.push(false);
  }

  private onDeleted(event: SensorDeleted) {
  }

  protected getEventName(event): string {
    if (isValidEvent(event)) {
      return event.eventType;
    } else {
      return super.getEventName(event);
    }
  }
}

interface SensorState {
  id: string;
  actives: Array<boolean>;

  active: boolean;
}

class SensorStateImpl implements SensorState {
  constructor(
    public readonly id: string,
    public actives: boolean[] = []
  ) { }

  get active(): boolean {
    return this.actives.length ? this.actives[this.actives.length - 1] : undefined;
  }
}
