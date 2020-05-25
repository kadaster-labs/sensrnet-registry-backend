import { ICommand } from "@nestjs/cqrs";


export class UpdateSensorCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly legalBase: string,
    public readonly typeName: string,
    public readonly typeDetails: object
    ) {}
}
