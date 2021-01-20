import { ICommand } from '@nestjs/cqrs';
import { CreateDatastreamBody } from '../controller/model/create-datastream.body';

export class CreateSensorCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly location: number[],
    public readonly baseObjectId: string,
    public readonly dataStreams: CreateDatastreamBody[],
    public readonly aim: string,
    public readonly description: string,
    public readonly manufacturer: string,
    public readonly active: boolean,
    public readonly observationArea: Record<string, any>,
    public readonly documentationUrl: string,
    public readonly theme: string[],
    public readonly category: string,
    public readonly typeName: string,
    public readonly typeDetails: Record<string, any>,
    ) {}
}
