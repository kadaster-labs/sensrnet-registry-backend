import { IQuery } from '@nestjs/cqrs';

export class RetrieveUserQuery implements IQuery {
    constructor(
        public readonly userId: string,
        public readonly legalEntityId: string,
    ) {}
}
