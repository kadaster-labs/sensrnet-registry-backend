import { ICommand } from '@nestjs/cqrs';

export class RegisterOwnerCommand implements ICommand {
  constructor(
    public readonly ownerId: string,
    public readonly nodeId: string,
    public readonly organisationName: string,
    public readonly website: string,
    public readonly name: string,
    public readonly contactEmail: string,
    public readonly contactPhone: string,
    ) {}
}
