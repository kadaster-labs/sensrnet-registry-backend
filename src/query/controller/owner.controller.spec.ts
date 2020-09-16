import { Request } from 'express';
import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { OwnerController } from './owner.controller';
import { RetrieveOwnersQuery } from '../model/retrieve-owner.query';

const testOwners = [
    {
        _id: 'test-id',
        name: 'test-owner',
    }, {
        _id: 'test-id-2',
        name: 'test-owner-2',
    },
];

describe('OwnerController', () => {
    let queryBus: QueryBus;
    let ownerController: OwnerController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [
                OwnerController,
            ],
            providers: [
                QueryBus,
            ],
        }).compile();

        queryBus = moduleRef.get<QueryBus>(QueryBus);
        ownerController = moduleRef.get<OwnerController>(OwnerController);

        jest.spyOn(queryBus, 'execute').mockImplementation(async (query: RetrieveOwnersQuery) => {
            return testOwners.filter((owner) => owner._id === query.id);
        });
    });

    describe('retrieveOwner', () => {
        it('should return an array of owners', async () => {
            const req: Request = {user: {ownerId: 'test-id'}} as any;
            const filteredOwners = await ownerController.retrieveOwner(req);
            expect(filteredOwners).toHaveLength(1);
        });
    });

    describe('retrieveOwner', () => {
        it('should not return an empty array', async () => {
            const req: Request = {user: {ownerId: 'wrong-test-id'}} as any;
            const filteredOwners = await ownerController.retrieveOwner(req);
            expect(filteredOwners).toHaveLength(0);
        });
    });
});
