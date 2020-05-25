import { ICommand } from "@nestjs/cqrs";


export class TransferSensorOwnershipCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly oldOwnerId: string,
    public readonly newOwnerId: string
    ) {}
}
