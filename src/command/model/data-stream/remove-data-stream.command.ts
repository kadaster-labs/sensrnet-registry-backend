import { ICommand } from '@nestjs/cqrs';

export class RemoveDataStreamCommand implements ICommand {
  constructor(
    public readonly deviceId: string,
    public readonly sensorId: string,
    public readonly legalEntityId: string,
    public readonly dataStreamId: string,
    ) {}
}
