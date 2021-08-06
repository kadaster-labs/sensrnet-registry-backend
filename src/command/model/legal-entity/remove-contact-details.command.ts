import { ICommand } from '@nestjs/cqrs';

export class RemoveContactDetailsCommand implements ICommand {
    constructor(public readonly legalEntityId: string, public readonly contactDetailsId: string) {}
}
