import { ICommand } from '@nestjs/cqrs';
import { RegisterSensorDto } from '../../dtos/register-sensor.dto';


export class RegisterSensorCommand implements ICommand {
  constructor(
    public readonly dto: RegisterSensorDto,
  ) {}
}
