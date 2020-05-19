import { ICommand } from '@nestjs/cqrs';
import { SensorIdDto } from '../../dtos/sensor.dto';


export class RemoveSensorCommand implements ICommand {
  constructor(
    public readonly dto: SensorIdDto,
  ) {}
}
