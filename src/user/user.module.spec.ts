import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OwnerRepository } from '../core/repositories/owner.repository';
import { DeleteUserCommandHandler } from './handler/delete-user.handler';
import { UpdateUserCommandHandler } from './handler/update-user.handler';
import { RegisterUserCommandHandler } from './handler/register-user.handler';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateOne: async (values, _) => {
        if (!testObjects.map((obj) => obj._id).includes(values._id)) {
            throw new Error('User does not exist.');
        }
    },
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

    it(`Should check hash`, async () => {
        let hashedPassword = null;

        const newPass = 'test-pass';
        jest.spyOn(mockUserRepository, 'updateOne').mockImplementation(async (_, values) => {
            hashedPassword = values.password;
        });

        await userService.updateOne(testUserOne._id, {password: newPass});

        expect(hashedPassword).toBeTruthy();
        expect(hashedPassword).not.toBe(newPass);
    });
});
