import { Model } from 'mongoose';
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

    async execute(query: LegalEntitiesQuery): Promise<any> {
        const fields: Record<string, any> = { originSync: false };

        if (query.deviceId) {
            const relationDocs: Array<IRelation> = await this.relationModel.find({ targetId: query.deviceId });
            fields._id = { $in: relationDocs.map(doc => doc.legalEntityId) };
        }

        if (query.website) {
            fields.website = { $regex: `^${query.website}` };
        }

        return this.legalEntityModel.find(fields, {}, { limit: this.limit });
    }
}
