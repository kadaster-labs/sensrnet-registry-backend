import { Logger } from '@nestjs/common';
import { Owner } from "../models/owner.model";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OwnerUpdatedCommand } from "./owner-updated.command";


@CommandHandler(OwnerUpdatedCommand)
export class OwnerUpdatedHandler implements ICommandHandler<OwnerUpdatedCommand> {

    async execute(command: OwnerUpdatedCommand): Promise<void> {
        const ownerData = {};
        if (command.data["nodeId"]) ownerData["nodeId"] = command.data["nodeId"];
        if (command.data["ssoId"]) ownerData["ssoId"] = command.data["ssoId"];
        if (command.data["email"]) ownerData["email"] = command.data["email"];
        if (command.data["publicName"]) ownerData["publicName"] = command.data["publicName"];
        if (command.data["name"]) ownerData["name"] = command.data["name"];
        if (command.data["companyName"]) ownerData["companyName"] = command.data["companyName"];
        if (command.data["website"]) ownerData["website"] = command.data["website"];

        Owner.updateOne({_id: command.id}, ownerData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
