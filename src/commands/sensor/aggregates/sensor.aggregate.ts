import { AggregateRoot } from "@nestjs/cqrs";
import { SensorUpdated } from "../../../events/sensor/events/updated.event";
import { SensorDeleted } from "../../../events/sensor/events/deleted.event";
import { SensorActivated } from "../../../events/sensor/events/activated.event";
import { SensorCreated } from "../../../events/sensor/events/created.event";
import { SensorDeactivated } from "../../../events/sensor/events/deactivated.event";
import { isValidEvent } from "../../../event-store/event-utils";
import { LocationBody } from "../models/bodies/location-body";
import { SensorOwnershipShared } from "../../../events/sensor/events/ownershipshared.event";
import { DataStreamBody } from "../models/bodies/datastream-body";
import { SensorLocationUpdated } from "../../../events/sensor/events/locationupdated.event";
import { DataStreamCreated } from "../../../events/sensor/events/datastreamcreated.event";
import { DataStreamDeleted } from "../../../events/sensor/events/datastreamdeleted.event";
import { SensorActiveException, SensorInActiveException } from "../errors/sensor-active-exception";
import { SensorOwnershipTransferred } from "../../../events/sensor/events/ownershiptransferred.event";


export class SensorAggregate extends AggregateRoot {
  state!: SensorState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  create(nodeId: string, ownerIds: Array<string>, name: string, location: LocationBody, 
    dataStreams: Array<DataStreamBody>, aim: string, description: string, manufacturer: string, 
    active: boolean, observationArea: object, documentationUrl: string, theme: Array<string>,
    typeName: string, typeDetails: object) {
    this.apply(new SensorCreated(this.aggregateId, nodeId, ownerIds, name, location, 
      aim, description, manufacturer, active, observationArea, documentationUrl, 
      theme, typeName, typeDetails));

    for (const dataStream of dataStreams) {
      this.createDataStream(dataStream.dataStreamId, dataStream.name, dataStream.reason, dataStream.description,
        dataStream.observedProperty, dataStream.unitOfMeasurement, dataStream.isPublic, dataStream.isOpenData, 
        dataStream.isReusable, dataStream.documentationUrl, dataStream.dataLink, dataStream.dataFrequency, 
        dataStream.dataQuality);
    }
  }

  createDataStream(dataStreamId: string, name: string, reason: string, description: string, observedProperty: string, 
    unitOfMeasurement: string, isPublic: boolean, isOpenData: boolean, isReusable: boolean, documentationUrl: string,
    dataLink: string, dataFrequency: number, dataQuality: number) {
    this.apply(new DataStreamCreated(this.aggregateId, dataStreamId, name, reason, description, observedProperty, 
      unitOfMeasurement, isPublic, isOpenData, isReusable, documentationUrl, dataLink, dataFrequency, dataQuality));
  }

  deleteDataStream(sensorId: string, dataStreamId: string) {
    this.apply(new DataStreamDeleted(this.aggregateId, sensorId, dataStreamId));
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

  shareOwnership(ownerId: string) {
    this.apply(new SensorOwnershipShared(this.aggregateId, ownerId));
  }

  updateLocation(x: number, y: number, z: number, epsgCode: number, baseObjectId: string) {
    this.apply(new SensorLocationUpdated(this.aggregateId, x, y, z, epsgCode, baseObjectId));
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

  private onSensorCreated(event: SensorCreated) {
    this.state = new SensorStateImpl(this.aggregateId);

    this.state.actives.push(event.data["active"]);
  }

  private onDataStreamCreated(event: DataStreamCreated) {
    // Called on DataStreamCreated -> Update Database.
  }

  private onDataStreamDeleted(event: DataStreamDeleted) {
    // Called on DataStreamDeleted -> Update Database.
  }

  private onUpdated(event: SensorUpdated) {
    // Called on Updated -> Update Database.
  }

  private onOwnershipTransferred(event: SensorOwnershipTransferred) {
    // Called on OwnershipTransferred -> Update Database.
  }

  private onOwnershipShared(event: SensorOwnershipShared) {
    // Called on OwnershipShared -> Update Database.
  }

  private onLocationUpdated(event: SensorLocationUpdated) {
    // Called on LocationUpdated -> Update Database.
  }

  private onActivated(event: SensorActivated) {
    this.state.actives.push(true);
  }

  private onDeactivated(event: SensorDeactivated) {
    this.state.actives.push(false);
  }

  private onDeleted(event: SensorDeleted) {
    // Called on Deleted -> Update Database.
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
  ) {}

  get active(): boolean {
    return this.actives.length ? this.actives[this.actives.length - 1] : undefined;
  }
}
