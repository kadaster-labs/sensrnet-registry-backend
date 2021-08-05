import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IObservationGoal } from '../model/observation-goal.schema';
import { ObservationGoalQuery } from '../model/observation-goal.query';

@QueryHandler(ObservationGoalQuery)
export class ObservationGoalQueryHandler implements IQueryHandler<ObservationGoalQuery> {
    constructor(
        @InjectModel('ObservationGoal') private model: Model<IObservationGoal>,
    ) {}

    async execute(query: ObservationGoalQuery): Promise<IObservationGoal> {
        return this.model.findOne({ _id: query.id });
    }
}
