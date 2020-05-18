import { AggregateRoot } from '@nestjs/cqrs';
import { SensorRegisteredEvent } from '../events/impl/sensor-registered.event';
import { SensorUpdatedEvent } from '../events/impl/sensor-updated.event';
import { SensorDeletedEvent } from '../events/impl/sensor-deleted.event';
import { SensorWelcomedEvent } from '../events/impl/sensor-welcomed.event';
import { SensorDto } from '../dtos/sensors.dto';

export class Sensor extends AggregateRoot {
  [x: string]: any;

  constructor(private readonly id: string | undefined) {
    super();
  }

  setData(data) {
    this.data = data;
  }

  createSensor() {
    this.apply(new SensorRegisteredEvent(this.data));
  }

  updateSensor() {
    this.apply(new SensorUpdatedEvent(this.data));
  }

  welcomeSensor() {
    this.apply(new SensorWelcomedEvent(this.id));
  }

  deleteSensor() {
    this.apply(new SensorDeletedEvent(this.id));
  }
}
