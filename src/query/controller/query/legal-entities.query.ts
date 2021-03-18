import { IQuery } from '@nestjs/cqrs';

export class LegalEntitiesQuery implements IQuery {
    constructor(
        public readonly website?: string,
        public readonly deviceId?: string,
    ) { }
}
