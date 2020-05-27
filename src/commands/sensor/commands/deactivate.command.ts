import { ICommand } from "@nestjs/cqrs";


export class DeactivateSensorCommand implements ICommand {
  constructor(
    public readonly sensorId: string
    ) {}
}
