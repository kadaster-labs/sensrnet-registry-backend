import { ICommand } from '@nestjs/cqrs';

export class DeleteDatastreamCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly organizationId: string,
    public readonly dataStreamId: string,
    ) {}
}
