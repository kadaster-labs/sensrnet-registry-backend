import { ICommand } from "@nestjs/cqrs";


export class UpdateSensorLocationCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
    public readonly epsgCode: number,
    public readonly baseObjectId: string
    ) {}
}
