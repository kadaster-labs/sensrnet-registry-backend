import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { OwnerController } from './owner.controller';

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
    });

    describe('retrieveOwner', () => {
        it('should return an array of owners with the ownerId of the user', async () => {
            const result = [{_id: 1, name: 'John'}];
            jest.spyOn(queryBus, 'execute').mockImplementation(async () => result);

            const req = {user: {ownerId: 1}};
            expect(await ownerController.retrieveOwner(req)).toBe(result);
        });
    });
});
