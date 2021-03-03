import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ILegalEntity } from '../../model/legal-entity.model';
import { LegalEntitiesQuery } from '../query/legal-entities.query';

@QueryHandler(LegalEntitiesQuery)
export class LegalEntitiesQueryHandler implements IQueryHandler<LegalEntitiesQuery> {
    private limit = 50;

    constructor(
        @InjectModel('LegalEntity') private model: Model<ILegalEntity>,
    ) {}

    async execute(query: LegalEntitiesQuery): Promise<any> {
        const fields: Record<string, any> = {originSync: false};
        if (query.website) {
            fields.website = {$regex: `^${query.website}`};
        }

        return this.model.find(fields, {}, {limit: this.limit});
    }
}
