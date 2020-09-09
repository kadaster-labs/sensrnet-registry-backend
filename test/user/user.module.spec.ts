import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../../src/user/user.service';
import { UserController } from '../../src/user/user.controller';
import { OwnerRepository } from '../../src/core/repositories/owner.repository';
import { DeleteUserCommandHandler } from '../../src/user/handler/delete-user.handler';
import { UpdateUserCommandHandler } from '../../src/user/handler/update-user.handler';
import { RegisterUserCommandHandler } from '../../src/user/handler/register-user.handler';

const testUserOne = {
    _id: 'test-id',
    name: 'test-object',
};

const testUserTwo = {
    _id: 'test-id',
    name: 'test-object',
};

const testObjects = [testUserOne, testUserTwo];

const mockUserRepository = {
    find: (values) => Object.keys(values).length ? testObjects.filter((owner) => owner._id === values._id) : testObjects,
    findOne: (values) => {
        let result;
        if (Object.keys(values).length) {
            const filtered = testObjects.filter((owner) => owner._id === values._id);
            if (filtered.length) {
                result = filtered[0];
            }
        } else if (testObjects.length) {
            result = testObjects[0];
        }

        return result;
    },
    updateOne: async () => void 0,
};

const mockOwnerRepository = {
    get: (aggregateId: string) => testObjects.map((obj) => obj._id).includes(aggregateId),
};

describe('User (integration)', () => {
    let moduleRef;
    let userService;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                CqrsModule,
            ],
            controllers: [
                UserController,
            ],
            providers: [
                UserService,
                // user
                DeleteUserCommandHandler,
                UpdateUserCommandHandler,
                RegisterUserCommandHandler,
                {
                    provide: getModelToken('User'),
                    useValue: mockUserRepository,
                },
                {
                    provide: OwnerRepository,
                    useValue: mockOwnerRepository,
                },
            ],
        }).compile();

        userService = moduleRef.get(UserService);
    });

    it(`Should find user`, async () => {
        const user = await userService.findOne(testUserOne._id);
        expect(user ? user._id : undefined).toBe(testUserOne._id);
    });

    it(`Should not find user`, async () => {
        const user = await userService.findOne('wrong-test-id');
        expect(user).toBe(undefined);
    });

    it(`Should update user`, async () => {
        let success;
        try {
            await userService.updateOne('wrong-test-id', {name: 'test-new-name'});
            success = true;
        } catch {
            success = false;
        }
        expect(success).toBeTruthy();
    });
});
