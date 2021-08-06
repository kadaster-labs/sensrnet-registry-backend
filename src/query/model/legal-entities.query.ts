import { IQuery } from '@nestjs/cqrs';

export class LegalEntitiesQuery implements IQuery {
    constructor(public readonly name?: string, public readonly deviceId?: string, public readonly allNodes?: string) {}
}
