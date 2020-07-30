import { ICommand } from '@nestjs/cqrs';

export class DeleteSensorCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    ) {}
}
