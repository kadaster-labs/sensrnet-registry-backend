import { ICommand } from '@nestjs/cqrs';

export class DeleteLegalEntityCommand implements ICommand {
  constructor(
    public readonly id: string,
  ) {}
}
