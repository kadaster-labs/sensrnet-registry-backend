import { AggregateRoot } from "@nestjs/cqrs";
import { SensorUpdated } from "../events/updated.event";
import { SensorDeleted } from "../events/deleted.event";
import { SensorActivated } from "../events/activated.event";
import { SensorCreated } from "../events/created.event";
import { SensorDeactivated } from "../events/deactivated.event";
import { isValidEvent } from "../../event-store/event-utils";
import { LocationBody } from "../models/bodies/location-body";
import { SensorOwnershipShared } from "../events/ownershipshared.event";
import { DataStreamBody } from "../models/bodies/datastream-body";
import { SensorLocationUpdated } from "../events/locationupdated.event";
import { DataStreamCreated } from "../events/datastreamcreated.event";
import { DataStreamDeleted } from "../events/datastreamdeleted.event";
import { SensorActiveException } from "../errors/sensor-active-exception";
import { SensorOwnershipTransferred } from "../events/ownershiptransferred.event";


export class SensorAggregate extends AggregateRoot {
  state!: SensorState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  create(nodeId: string, ownerIds: Array<string>, location: LocationBody, legalBase: string, active: boolean,
    typeName: string, typeDetails: object, dataStreams: Array<DataStreamBody>) {
    this.apply(new SensorCreated(this.aggregateId, new Date().toISOString(), nodeId, ownerIds, 
      location, legalBase, active, typeName, typeDetails));

    for (const dataStream of dataStreams) {
      this.apply(new DataStreamCreated(this.aggregateId, new Date().toISOString(), dataStream.name));
    }
  }

  createDataStream(name: string) {
    this.apply(new DataStreamCreated(this.aggregateId, new Date().toISOString(), name));
  }

  deleteDataStream(name: string) {
    this.apply(new DataStreamDeleted(this.aggregateId, new Date().toISOString(), name));
  }

  update(legalBase: string, typeName: string, typeDetails: object) {
    this.apply(new SensorUpdated(this.aggregateId, new Date().toISOString(), legalBase, typeName, typeDetails));
  }

  transferOwnership(oldOwnerId: string, newOwnerId: string) {
    this.apply(new SensorOwnershipTransferred(this.aggregateId, new Date().toISOString(), oldOwnerId, newOwnerId));
  }

  shareOwnership(ownerId: string) {
    this.apply(new SensorOwnershipShared(this.aggregateId, new Date().toISOString(), ownerId));
  }

  updateLocation(lat: number, lon: number, height: number, baseObjectId: string) {
    this.apply(new SensorLocationUpdated(this.aggregateId, new Date().toISOString(), lat, lon, height, baseObjectId));
  }

  activate() {
    if (this.state.active) {
      throw new SensorActiveException(this.state.id)
    }

    this.apply(new SensorActivated(this.aggregateId, new Date().toISOString()));
  }

  deactivate() {
    this.apply(new SensorDeactivated(this.aggregateId, new Date().toISOString()));
  }

  delete() {
    this.apply(new SensorDeleted(this.aggregateId, new Date().toISOString()));
  }

  private onSensorCreated(event: SensorCreated) {
    this.state = new SensorStateImpl(this.aggregateId);

    this.state.actives.push([event.data["date"], event.data["active"]]);
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
    this.state.actives.push([event.data["date"], true]);
  }

  private onDeactivated(event: SensorDeactivated) {
    this.state.actives.push([event.data["date"], false]);
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
  actives: Array<[string, boolean]>;

  active: boolean;
}

class SensorStateImpl implements SensorState {
  constructor(
    public readonly id: string,
    public actives: [string, boolean][] = []
  ) {}

  // Sort descending;
  sort = (value1: [string, any], value2: [string, any]) => value1[0] < value2[0] ? 1 : -1;

  get active(): boolean {
    return this.actives.sort(this.sort).map(value => value[1])[0];
  }
}
