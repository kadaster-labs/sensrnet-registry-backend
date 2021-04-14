import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IObservationGoal } from '../../model/observation-goal.model';
import { ObservationGoalsQuery } from '../query/observation-goals.query';

@QueryHandler(ObservationGoalsQuery)
export class ObservationGoalsQueryHandler implements IQueryHandler<ObservationGoalsQuery> {
    private pageSize = 10;

    constructor(
        @InjectModel('ObservationGoal') private model: Model<IObservationGoal>,
    ) {}

    async execute(query: ObservationGoalsQuery): Promise<any> {
        const pageSize = typeof query.pageSize === 'undefined' ? this.pageSize : query.pageSize;
        const start = typeof query.pageIndex === 'undefined' ? 0 : query.pageIndex * pageSize;

        const filter: Record<string, any> = {};
        if (query.name) {
            filter.name = { $regex: `^${query.name}` };
        }

        const options: Record<string, any> = {
            skip: start, limit: pageSize,
        };
        if (query.sortField) {
            options.sort = {};
            options.sort[query.sortField] = query.sortDirection === 'DESCENDING' ? -1 : 1;
        }

        return this.model.find(filter, {}, options);
    }
}
