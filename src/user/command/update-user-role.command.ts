import { ICommand } from '@nestjs/cqrs';

export class UpdateUserRoleCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly legalEntityId: string,
    public readonly role?: number,
    ) {}
}
