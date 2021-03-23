import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ILegalEntity } from '../../model/legal-entity.model';
import { LegalEntitiesQuery } from '../query/legal-entities.query';
import { IRelation } from '../../model/relation.model';

@QueryHandler(LegalEntitiesQuery)
export class LegalEntitiesQueryHandler implements IQueryHandler<LegalEntitiesQuery> {
    private limit = 50;

    constructor(
        @InjectModel('LegalEntity') private legalEntityModel: Model<ILegalEntity>,
        @InjectModel('Relation') private relationModel: Model<IRelation>,
    ) { }

    async execute(query: LegalEntitiesQuery): Promise<ILegalEntity[]> {
        const filter: FilterQuery<ILegalEntity> = { };

        if (query.deviceId) {
            const relationDocs: Array<IRelation> = await this.relationModel.find({ targetId: query.deviceId });
            filter._id = { $in: relationDocs.map(doc => doc.legalEntityId) };
        }

        if (query.website) {
            filter.website = { $regex: `^${query.website}` };
        }

        if (!query.allNodes || query.allNodes !== 'true') {
            filter.originSync = 'false';
        }

        return this.legalEntityModel.find(filter, {}, { limit: this.limit });
    }
}
