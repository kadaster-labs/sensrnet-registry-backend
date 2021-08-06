import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { LegalEntitiesQuery } from '../model/legal-entities.query';
import { ILegalEntity } from '../model/legal-entity.schema';
import { IRelation } from '../model/relation.schema';

@QueryHandler(LegalEntitiesQuery)
export class LegalEntitiesQueryHandler implements IQueryHandler<LegalEntitiesQuery> {
    private limit = 50;

    constructor(
        @InjectModel('LegalEntity') private legalEntityModel: Model<ILegalEntity>,
        @InjectModel('Relation') private relationModel: Model<IRelation>,
    ) {}

    async execute(query: LegalEntitiesQuery): Promise<ILegalEntity[]> {
        const filter: FilterQuery<ILegalEntity> = {};

        if (query.deviceId) {
            const relationDocs: IRelation[] = await this.relationModel.find({ targetId: query.deviceId });
            filter._id = { $in: relationDocs.map(doc => doc.legalEntityId) };
        }

        if (query.name) {
            filter.name = { $regex: `^${query.name}` };
        }

        if (!query.allNodes || query.allNodes !== 'true') {
            filter.originSync = 'false';
        }

        return this.legalEntityModel.find(filter, {}, { limit: this.limit });
    }
}
