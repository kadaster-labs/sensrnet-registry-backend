import { IQuery } from '@nestjs/cqrs';

export class RetrieveOrganizationQuery implements IQuery {
    constructor(
        public readonly id: string,
    ) {}
}
