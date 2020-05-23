import { ICommand } from "@nestjs/cqrs";


export class CreateCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly nodeId: string,
    public readonly ssoId: string,
    public readonly email: string,
    public readonly publicName: string,
    public readonly name: string,
    public readonly companyName: string,
    public readonly website: string
    ) {}
}
