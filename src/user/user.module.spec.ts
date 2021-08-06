import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { DeleteUserCommandHandler } from './handler/delete-user.handler';
import { LegalEntityRepository } from '../core/repositories/legal-entity.repository';
import { JoinLegalEntityCommandHandler } from './handler/join-legal-entity.handler';
import { LeaveLegalEntityCommandHandler } from './handler/leave-legal-entity.handler';

const testUserOne = {_id: 'test-id', name: 'test-object'};
const testUserTwo = {_id: 'test-id', name: 'test-object'};
const testUsers = [testUserOne, testUserTwo];

const mockUserModel = {
    findOne: (values) => {
        let result;
        if (Object.keys(values).length) {
            const filtered = testUsers.filter((user) => user._id === values._id);
            if (filtered.length) {
                result = filtered[0];
            }
        } else if (testUsers.length) {
            result = testUsers[0];
        }
        return result;
    },
    updateOne: async (...args: any[]) => {
        const values = args[0];
        if (!testUsers.map((obj) => obj._id).includes(values._id)) {
            throw new Error('User does not exist.');
        }
    },
};

const mockLegalEntityRepository = {
    get: (aggregateId: string) => testUsers.map((obj) => obj._id).includes(aggregateId),
};

describe('User (integration)', () => {
    let moduleRef;
    let userService;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                CqrsModule,
            ], controllers: [
                UserController,
            ], providers: [
                UserService,
                // user
                DeleteUserCommandHandler,
                JoinLegalEntityCommandHandler,
                LeaveLegalEntityCommandHandler,
                {
                    provide: getModelToken('User'),
                    useValue: mockUserModel,
                }, {
                    provide: getModelToken('UserPermissions'),
                    useValue: mockUserModel,
                }, {
                    provide: LegalEntityRepository,
                    useValue: mockLegalEntityRepository,
                },
            ],
        }).compile();

        userService = moduleRef.get(UserService);
    });

    it(`Should find user`, async () => {
        const user = await userService.findOne({_id: testUserOne._id});
        expect(user ? user._id : undefined).toBe(testUserOne._id);
    });

    it(`Should not find user`, async () => {
        const user = await userService.findOne({_id: 'wrong-id'});
        expect(user).toBe(undefined);
    });

    it(`Should update user`, async () => {
        let success;
        try {
            await userService.updateOne(testUserOne._id, {name: 'test-new-name'});
            success = true;
        } catch {
            success = false;
        }
        expect(success).toBeTruthy();
    });

    it(`Should not update user`, async () => {
        let success;
        try {
            await userService.updateOne('wrong-test-id', {name: 'test-new-name'});
            success = true;
        } catch {
            success = false;
        }
        expect(success).not.toBeTruthy();
    });
});
