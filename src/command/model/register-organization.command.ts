import { ICommand } from '@nestjs/cqrs';

export class RegisterOrganizationCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly website: string,
    public readonly contactName: string,
    public readonly contactEmail: string,
    public readonly contactPhone: string,
    ) {}
}
