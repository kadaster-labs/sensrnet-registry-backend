import { IQuery } from '@nestjs/cqrs';

export class RetrieveOrganizationsQuery implements IQuery {
    constructor(
        public readonly website?: string,
    ) {}
}
