import { IEvent } from '@nestjs/cqrs';
import { UpdateSensorDto } from '../../dtos/update-sensor.dto';


export class SensorUpdatedEvent implements IEvent {
  constructor(
    public readonly dto: UpdateSensorDto) {}
}

export class SensorOwnerUpdatedEvent implements IEvent {
  constructor(
    public readonly dto: UpdateSensorDto) {}
}
