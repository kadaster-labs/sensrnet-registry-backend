import { IEvent } from '@nestjs/cqrs';
import { RegisterSensorDto } from '../../dtos/register-sensor.dto';


export class SensorRegisteredEvent implements IEvent {
  constructor(
    public readonly dto: RegisterSensorDto) {}
}
