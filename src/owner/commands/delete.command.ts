import { ICommand } from "@nestjs/cqrs";


export class DeleteCommand implements ICommand {
  constructor(
    public readonly id: string
  ) {}
}
