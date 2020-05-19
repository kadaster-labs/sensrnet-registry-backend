import { AggregateRoot } from '@nestjs/cqrs';
import { SensorRemovedEvent } from '../events/impl/sensor-removed.event';
import { SensorRegisteredEvent } from '../events/impl/sensor-registered.event';
import { SensorUpdatedEvent, SensorOwnerUpdatedEvent } from '../events/impl/sensor-updated.event';


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

  updateSensor() {
    this.apply(new SensorUpdatedEvent(this.data));
  }

  updateSensorOwner() {
    this.apply(new SensorOwnerUpdatedEvent(this.data));
  }

  removeSensor() {
    this.apply(new SensorRemovedEvent(this.id));
  }
}
