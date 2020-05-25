import { ICommand } from "@nestjs/cqrs";


export class UpdateSensorLocationCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly lat: number,
    public readonly lon: number,
    public readonly height: number,
    public readonly baseObjectId: string
    ) {}
}
