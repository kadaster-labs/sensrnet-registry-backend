import { ICommand } from '@nestjs/cqrs';
import { SensorDto } from '../../dtos/sensors.dto';

export class CreateSensorCommand implements ICommand {
  constructor(
    public readonly sensorDto: SensorDto,
  ) {}
}
