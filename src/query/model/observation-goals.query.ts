import { IQuery } from '@nestjs/cqrs';

export class ObservationGoalsQuery implements IQuery {
    constructor(
        public readonly requestLegalEntityId?: string,
        public readonly name?: string,
        public readonly pageIndex?: number,
        public readonly pageSize?: number,
        public readonly sortField?: string,
        public readonly sortDirection?: string,
    ) {}
}
