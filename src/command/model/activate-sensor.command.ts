import { ICommand } from '@nestjs/cqrs';

export class ActivateSensorCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly ownerId: string,
    ) {}
}
