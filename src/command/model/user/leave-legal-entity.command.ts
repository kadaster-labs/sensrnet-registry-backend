import { ICommand } from '@nestjs/cqrs';

export class LeaveLegalEntityCommand implements ICommand {
    constructor(public readonly userId: string, public readonly legalEntityId: string) {}
}
