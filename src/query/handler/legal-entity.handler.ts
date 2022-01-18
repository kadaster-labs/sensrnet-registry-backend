import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LegalEntityQuery } from '../model/legal-entity.query';
import { ILegalEntity } from '../model/legal-entity.schema';

@QueryHandler(LegalEntityQuery)
export class LegalEntityQueryHandler implements IQueryHandler<LegalEntityQuery> {
    constructor(@InjectModel('LegalEntity') private model: Model<ILegalEntity>) {}

    async execute(query: LegalEntityQuery): Promise<any> {
        return this.model.findById(query.id);
    }
}
