import { ICommand } from '@nestjs/cqrs';

export class UpdateOwnerCommand implements ICommand {
  constructor(
    public readonly ownerId: string,
    public readonly organisationName: string,
    public readonly website: string,
    public readonly contactName: string,
    public readonly contactEmail: string,
    public readonly contactPhone: string,
  ) {}
}
