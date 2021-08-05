import { ICommand } from '@nestjs/cqrs';

export class LegalEntityCommand implements ICommand {
  constructor(
      public readonly legalEntityId: string,
      public readonly name: string,
      public readonly website: string,
  ) {}
}
