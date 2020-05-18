import { IEvent } from '@nestjs/cqrs';
import { SensorDto } from '../../dtos/sensors.dto';

export class SensorRegisteredEvent implements IEvent {
  constructor(
    public readonly sensorDto: SensorDto) {}
}
