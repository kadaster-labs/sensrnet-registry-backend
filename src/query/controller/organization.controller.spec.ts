import { Request } from 'express';
import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { OrganizationController } from './organization.controller';
import { RetrieveOrganizationQuery } from '../model/retrieve-organization.query';

const testOrganizations = [
    {
        _id: 'test-id',
        name: 'test-organization',
    }, {
        _id: 'test-id-2',
        name: 'test-organization-2',
    },
];

describe('OrganizationController', () => {
    let queryBus: QueryBus;
    let organizationController: OrganizationController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [
                OrganizationController,
            ], providers: [
                QueryBus,
            ],
        }).compile();

        queryBus = moduleRef.get<QueryBus>(QueryBus);
        organizationController = moduleRef.get<OrganizationController>(OrganizationController);

        jest.spyOn(queryBus, 'execute').mockImplementation(async (query: RetrieveOrganizationQuery) => {
            return testOrganizations.filter((organization) => organization._id === query.id);
        });
    });

    describe('retrieveOrganization', () => {
        it('should return an array of organizations', async () => {
            const req: Request = {user: {organizationId: 'test-id'}} as any;
            const organizations = await organizationController.retrieveOrganization(req);
            expect(organizations).toHaveLength(1);
        });
    });

    describe('retrieveOrganization', () => {
        it('should not return any organizations', async () => {
            const req: Request = {user: {organizationId: 'wrong-test-id'}} as any;
            const organizations = await organizationController.retrieveOrganization(req);
            expect(organizations).toHaveLength(0);
        });
    });
});
