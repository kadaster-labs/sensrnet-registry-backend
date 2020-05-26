import { Logger } from '@nestjs/common';
import { Owner } from "../models/owner.model";
import { OwnerDeletedCommand } from "./owner-deleted.command";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';


@CommandHandler(OwnerDeletedCommand)
export class OwnerDeletedHandler implements ICommandHandler<OwnerDeletedCommand> {

    async execute(command: OwnerDeletedCommand): Promise<void> {
        Owner.deleteOne({_id: command.id}, (err) => {
            if (err) Logger.error('Error while deleting projection.');
        });
    }
}
