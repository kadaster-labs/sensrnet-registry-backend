import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ILegalEntity } from '../model/legal-entity.schema';
import { LegalEntityQuery } from '../model/legal-entity.query';

@QueryHandler(LegalEntityQuery)
export class LegalEntityQueryHandler implements IQueryHandler<LegalEntityQuery> {
    constructor(
        @InjectModel('LegalEntity') private model: Model<ILegalEntity>,
    ) {}

    async execute(query: LegalEntityQuery): Promise<any> {
        return this.model.findOne({_id: query.id});
    }
}
