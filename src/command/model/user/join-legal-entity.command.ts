import { ICommand } from '@nestjs/cqrs';

export class JoinLegalEntityCommand implements ICommand {
    constructor(public readonly userId: string, public readonly legalEntityId: string) {}
}
