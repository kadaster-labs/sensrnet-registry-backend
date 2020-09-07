import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Owner } from '../data/owner.interface';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveOwnersQuery } from '../model/retrieve-owner.query';

@QueryHandler(RetrieveOwnersQuery)
export class RetrieveOwnerQueryHandler implements IQueryHandler<RetrieveOwnersQuery> {

    constructor(
        @InjectModel('Owner') private ownerModel: Model<Owner>,
    ) {}

    async execute(query: RetrieveOwnersQuery): Promise<any> {
        return this.ownerModel.find({_id: query.id});
    }
}
