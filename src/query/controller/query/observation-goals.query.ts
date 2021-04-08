import { IQuery } from '@nestjs/cqrs';

export class ObservationGoalsQuery implements IQuery {
    constructor(
        public readonly name?: string,
        public readonly pageIndex?: number,
        public readonly pageSize?: number,
    ) {}
}
