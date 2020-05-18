import { ICommand } from '@nestjs/cqrs';
import { SensorDto } from '../../dtos/sensors.dto';

export class UpdateSensorCommand implements ICommand {
  constructor(
    public readonly sensorDto: SensorDto,
  ) {}
}
