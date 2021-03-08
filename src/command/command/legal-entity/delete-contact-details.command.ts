import { ICommand } from '@nestjs/cqrs';

export class DeleteContactDetailsCommand implements ICommand {
  constructor(
    public readonly legalEntityId: string,
    public readonly contactDetailsId: string,
  ) { }
}
