import { ICommand } from '@nestjs/cqrs';

export class DeleteDataStreamCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly legalEntityId: string,
    public readonly dataStreamId: string,
    ) {}
}
