import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Organization } from '../data/organization.interface';
import { RetrieveOrganizationsQuery } from '../model/retrieve-organizations.query';

@QueryHandler(RetrieveOrganizationsQuery)
export class RetrieveOrganizationsQueryHandler implements IQueryHandler<RetrieveOrganizationsQuery> {
    private limit = 50;

    constructor(
        @InjectModel('Organization') private model: Model<Organization>,
    ) {}

    async execute(query: RetrieveOrganizationsQuery): Promise<any> {
        let fields = {};
        fields = {
            originSync: false, ...fields,
        };
        if (query.name) {
            fields = {
                _id: {
                    $regex: `^${query.name}`,
                }, ...fields,
            };
        }

        return this.model.find(fields, {}, {limit: this.limit});
    }
}
