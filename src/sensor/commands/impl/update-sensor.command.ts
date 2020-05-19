import { ICommand } from '@nestjs/cqrs';
import { UpdateSensorDto } from '../../dtos/update-sensor.dto';


export class UpdateSensorCommand implements ICommand {
  constructor(
    public readonly dto: UpdateSensorDto,
  ) {}
}


export class UpdateSensorOwnerCommand implements ICommand {
  constructor(
    public readonly dto: UpdateSensorDto,
  ) {}
}
