import { AggregateRoot } from '@nestjs/cqrs';
import { SensorRemovedEvent } from '../events/impl/sensor-removed.event';
import { SensorRegisteredEvent } from '../events/impl/sensor-registered.event';
import { SensorDetailsUpdatedEvent, SensorOwnershipTransferredEvent,
  SensorOwnershipSharedEvent, SensorActivatedEvent,
  SensorDeactivatedEvent, DataStreamAddedEvent, 
  DataStreamRemovedEvent, SensorLocationUpdatedEvent } from '../events/impl/sensor-updated.event';


export class Sensor extends AggregateRoot {
  [x: string]: any;

  constructor(private readonly id: string | undefined) {
    super();
  }

  setData(data) {
    this.data = data;
  }

  registerSensor() {
    this.apply(new SensorRegisteredEvent(this.data));
  }

  updateSensorDetails() {
    this.apply(new SensorDetailsUpdatedEvent(this.data));
  }

  transferSensorOwnership() {
    this.apply(new SensorOwnershipTransferredEvent(this.data));
  }

  shareSensorOwnership() {
    this.apply(new SensorOwnershipSharedEvent(this.data));
  }

  updateSensorLocation() {
    this.apply(new SensorLocationUpdatedEvent(this.data));
  }

  activateSensor() {
    this.apply(new SensorActivatedEvent(this.id));
  }

  deactivateSensor() {
    this.apply(new SensorDeactivatedEvent(this.id));
  }

  removeSensor() {
    this.apply(new SensorRemovedEvent(this.id));
  }
}

export class DataStream extends AggregateRoot {
  [x: string]: any;

  constructor(private readonly id: string | undefined) {
    super();
  }

  setData(data) {
    this.data = data;
  }

  addDataStream() {
    this.apply(new DataStreamAddedEvent(this.data));
  }

  removeDataStream() {
    this.apply(new DataStreamRemovedEvent(this.data));
  }
}
