import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObservationGoalQuery } from '../model/observation-goal.query';
import { IObservationGoal } from '../model/observation-goal.schema';

@QueryHandler(ObservationGoalQuery)
export class ObservationGoalQueryHandler implements IQueryHandler<ObservationGoalQuery> {
    constructor(@InjectModel('ObservationGoal') private model: Model<IObservationGoal>) {}

    async execute(query: ObservationGoalQuery): Promise<IObservationGoal> {
        return this.model.findOne({ _id: query.id });
    }
}
