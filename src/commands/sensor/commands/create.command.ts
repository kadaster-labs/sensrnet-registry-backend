import { ICommand } from "@nestjs/cqrs";
import { LocationBody } from '../models/bodies/location-body';
import { DataStreamBody } from '../models/bodies/datastream-body';


export class CreateSensorCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly nodeId: string,
    public readonly ownerIds: Array<string>,
    public readonly name: string,
    public readonly location: LocationBody,
    public readonly dataStreams: Array<DataStreamBody>,
    public readonly aim: string,
    public readonly description: string,
    public readonly manufacturer: string,
    public readonly active: boolean,
    public readonly observationArea: object,
    public readonly documentationUrl: string,
    public readonly theme: Array<string>,
    public readonly typeName: string,
    public readonly typeDetails: object
    ) {}
}
