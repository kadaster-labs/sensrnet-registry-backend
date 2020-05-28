import { ICommand } from "@nestjs/cqrs";


export class CreateOwnerCommand implements ICommand {
  constructor(
    public readonly ownerId: string,
    public readonly nodeId: string,
    public readonly ssoId: string,
    public readonly email: string,
    public readonly publicName: string,
    public readonly name: string,
    public readonly companyName: string,
    public readonly website: string
    ) {}
}
