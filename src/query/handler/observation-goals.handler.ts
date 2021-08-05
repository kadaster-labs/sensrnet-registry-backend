import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IObservationGoal } from '../model/observation-goal.schema';
import { ObservationGoalsQuery } from '../model/observation-goals.query';
import { IRelation, TargetVariant } from '../model/relation.schema';

@QueryHandler(ObservationGoalsQuery)
export class ObservationGoalsQueryHandler implements IQueryHandler<ObservationGoalsQuery> {
    private pageSize = 10;

    constructor(
        @InjectModel('Relation') private relationModel: Model<IRelation>,
        @InjectModel('ObservationGoal') private model: Model<IObservationGoal>,
    ) {}

    async execute(query: ObservationGoalsQuery): Promise<IObservationGoal[]> {
        let myObservationGoalsIds;
        if (query.requestLegalEntityId) {
            const relationFilter = {
                legalEntityId: query.requestLegalEntityId,
                targetVariant: TargetVariant.OBSERVATION_GOAL,
            };
            const myRelations = await this.relationModel.find(relationFilter);
            myObservationGoalsIds = myRelations.map(x => x.targetId);
        } else {
            myObservationGoalsIds = [];
        }
        const myObservationGoalsIdsSet = new Set(myObservationGoalsIds);

        const pageSize = typeof query.pageSize === 'undefined' ? this.pageSize : query.pageSize;
        const start = typeof query.pageIndex === 'undefined' ? 0 : query.pageIndex * pageSize;

        const filter: FilterQuery<IObservationGoal> = {};
        if (query.name) {
            filter.name = { $regex: `^${query.name}` , $options : 'i' };
        }

        const options: QueryOptions = {
            skip: start, limit: pageSize,
        };
        if (query.sortField) {
            options.sort = {};
            options.sort[query.sortField] = query.sortDirection === 'DESCENDING' ? -1 : 1;
        }

        const observationGoals = [];
        const mongoObservationGoals = await this.model.find(filter, {}, options);
        for (const observationGoal of mongoObservationGoals) {
            observationGoals.push({canEdit: myObservationGoalsIdsSet.has(observationGoal._id), ...observationGoal.toObject()});
        }

        return observationGoals;
    }
}
