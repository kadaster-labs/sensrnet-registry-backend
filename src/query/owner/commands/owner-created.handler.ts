import { Owner } from "../models/owner.model";
import { OwnerGateway } from '../owner.gateway';
import { OwnerCreatedCommand } from "./owner-created.command";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';


@CommandHandler(OwnerCreatedCommand)
export class OwnerCreatedHandler implements ICommandHandler<OwnerCreatedCommand> {

    constructor(
        private readonly gateway: OwnerGateway
    ) {}

    async execute(command: OwnerCreatedCommand): Promise<void> {
        const ownerInstance = new Owner({
            _id: command.id,
            nodeId: command.data["nodeId"],
            ssoId: command.data["ssoId"],
            email: command.data["email"],
            publicName: command.data["publicName"],
            name: command.data["name"],
            companyName: command.data["companyName"],
            website: command.data["website"]
        });
        ownerInstance.save(() => this.gateway.notifyClients(ownerInstance));
    }
}
