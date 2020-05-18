import { ICommand } from '@nestjs/cqrs';
import { SensorIdRequestParamsDto } from '../../dtos/sensors.dto';

export class DeleteSensorCommand implements ICommand {
  constructor(
    public readonly sensorDto: SensorIdRequestParamsDto,
  ) {}
}
