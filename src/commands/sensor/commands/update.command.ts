import { ICommand } from "@nestjs/cqrs";


export class UpdateSensorCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly aim: string,
    public readonly description: string,
    public readonly manufacturer: string,
    public readonly observationArea: object,
    public readonly documentationUrl: string,
    public readonly theme: Array<string>,
    public readonly typeName: string,
    public readonly typeDetails: object
    ) {}
}
