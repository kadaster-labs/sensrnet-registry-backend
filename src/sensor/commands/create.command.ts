import { ICommand } from "@nestjs/cqrs";
import { LocationBody } from '../models/bodies/location-body';
import { DataStreamBody } from '../models/bodies/datastream-body';


export class CreateSensorCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly nodeId: string,
    public readonly ownerIds: Array<string>,
    public readonly location: LocationBody,
    public readonly legalBase: string,
    public readonly active: boolean,
    public readonly typeName: string,
    public readonly typeDetails: object,
    public readonly dataStreams: Array<DataStreamBody>
    ) {}
}
