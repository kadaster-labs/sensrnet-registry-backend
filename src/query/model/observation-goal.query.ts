import { IQuery } from '@nestjs/cqrs';

export class ObservationGoalQuery implements IQuery {
    constructor(
        public readonly id: string,
    ) {}
}
