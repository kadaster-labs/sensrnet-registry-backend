import { RetrieveOwnersQuery } from './retrieve.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Owner} from '../owner.interface';

@QueryHandler(RetrieveOwnersQuery)
export class RetrieveOwnerQueryHandler implements IQueryHandler<RetrieveOwnersQuery> {

    constructor(
        @InjectModel('Owner') private ownerModel: Model<Owner>,
    ) {
    }

    async execute(query: RetrieveOwnersQuery) {
        return await this.ownerModel.find({_id: query.id});
    }
}
