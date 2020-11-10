import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Organization } from '../data/organization.interface';
import { RetrieveOrganizationQuery } from '../model/retrieve-organization.query';

@QueryHandler(RetrieveOrganizationQuery)
export class RetrieveOrganizationQueryHandler implements IQueryHandler<RetrieveOrganizationQuery> {
    constructor(
        @InjectModel('Organization') private model: Model<Organization>,
    ) {}

    async execute(query: RetrieveOrganizationQuery): Promise<any> {
        return this.model.findOne({ _id: query.id });
    }
}
