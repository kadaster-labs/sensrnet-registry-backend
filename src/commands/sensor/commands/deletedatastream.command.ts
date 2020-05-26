import { ICommand } from "@nestjs/cqrs";


export class DeleteDataStreamCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dataStreamId: string
    ) {}
}
