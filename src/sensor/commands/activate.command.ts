import { ICommand } from "@nestjs/cqrs";


export class ActivateSensorCommand implements ICommand {
  constructor(
    public readonly id: string
    ) {}
}
