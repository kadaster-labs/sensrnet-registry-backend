import { ICommand } from "@nestjs/cqrs";


export class CreateDataStreamCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name: string
    ) {}
}
