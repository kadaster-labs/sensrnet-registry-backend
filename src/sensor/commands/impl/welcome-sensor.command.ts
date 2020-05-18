import { ICommand } from '@nestjs/cqrs';

export class WelcomeSensorCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
  ) {}
}
