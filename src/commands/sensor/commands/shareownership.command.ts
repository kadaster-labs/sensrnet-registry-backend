import { ICommand } from "@nestjs/cqrs";


export class ShareSensorOwnershipCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly ownerId: string
    ) {}
}
