import { Model } from 'mongoose';
import { Owner } from '../data/owner.interface';
import { InjectModel } from '@nestjs/mongoose';
import { RetrieveOwnersQuery } from '../model/retrieve-owner.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(RetrieveOwnersQuery)
export class RetrieveOwnerQueryHandler implements IQueryHandler<RetrieveOwnersQuery> {

    constructor(
        @InjectModel('Owner') private ownerModel: Model<Owner>,
    ) {}

    async execute(query: RetrieveOwnersQuery) {
        return this.ownerModel.find({_id: query.id});
    }
}
