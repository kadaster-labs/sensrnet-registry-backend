import { ICommand } from '@nestjs/cqrs';

export class ContactDetailsCommand implements ICommand {
    constructor(
        public readonly legalEntityId: string,
        public readonly contactDetailsId: string,
        public readonly name: string,
        public readonly email: string,
        public readonly phone: string,
    ) {}
}
