import { ICommand } from "@nestjs/cqrs";


export class CreateDataStreamCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly dataStreamId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly unitOfMeasurement: string,
    public readonly isPublic: boolean,
    public readonly isOpenData: boolean,
    public readonly isReusable: boolean,
    public readonly documentationUrl: string,
    public readonly dataLink: string,
    public readonly dataFrequency: number,
    public readonly dataQuality: number
    ) {}
}