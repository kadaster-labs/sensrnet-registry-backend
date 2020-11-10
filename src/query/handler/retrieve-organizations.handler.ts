import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Organization } from '../data/organization.interface';
import { RetrieveOrganizationsQuery } from '../model/retrieve-organizations.query';

@QueryHandler(RetrieveOrganizationsQuery)
export class RetrieveOrganizationsQueryHandler implements IQueryHandler<RetrieveOrganizationsQuery> {
    constructor(
        @InjectModel('Organization') private model: Model<Organization>,
    ) {}

    async execute(query: RetrieveOrganizationsQuery): Promise<any> {
        return this.model.find();
    }
}
