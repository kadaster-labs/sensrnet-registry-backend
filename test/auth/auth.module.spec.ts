import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../../src/auth/constants';
import { UserService } from '../../src/user/user.service';
import { AuthService } from '../../src/auth/auth.service';
import { LocalStrategy } from '../../src/auth/local.strategy';
import { AuthController } from '../../src/auth/auth.controller';
import { AccessJwtStrategy } from '../../src/auth/access-jwt.strategy';
import { RefreshJwtStrategy } from '../../src/auth/refresh-jwt.strategy';

const logger: Logger = new Logger();

const testUser = {
    _id: 'test-id',
    role: 'test-role',
    password: 'test-pass',
    ownerId: 'test-owner',
    refreshToken: 'test-refresh',
};

const mockUserService = {
    findOne: async () => {
        return {
            ...testUser,
            checkPassword: (password, callback) => {
                callback(null, testUser.password === password);
            },
            checkRefreshToken: (refreshToken, callback) => {
                callback(null, testUser.refreshToken === refreshToken);
            },
        };
    },
    updateOne: async () => true,
};

describe('Authentication (integration)', () => {
    let moduleRef;
    let authService;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                PassportModule,
                JwtModule.register({
                    secret: jwtConstants.secret,
                }),
            ],
            controllers: [
                AuthController,
            ],
            providers: [
                AuthService,
                LocalStrategy,
                AccessJwtStrategy,
                RefreshJwtStrategy,
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        authService = moduleRef.get(AuthService);
    });

    it(`Should validate user`, async () => {
        let result;
        try {
            result = await authService.validateUser(testUser._id, testUser.password);
        } catch {
            logger.log('Failed to validate.');
        }

        expect(result).toBeDefined();
    });

    it(`Should not validate user`, async () => {
        let result;
        try {
            result = await authService.validateUser(testUser._id, 'wrong-pass');
        } catch {
            logger.log('Failed to validate.');
        }

        expect(result).toBeNull();
    });

    it(`Should refresh user`, async () => {
        let result;
        try {
            result = await authService.refresh(testUser, testUser.refreshToken);
        } catch {
            logger.log('Failed to refresh.');
        }

        expect(result).toBeTruthy();
        expect(result.access_token).toBeDefined();
    });

    it(`Should not refresh user`, async () => {
        let result;
        try {
            result = await authService.refresh(testUser, 'wrong-refresh');
        } catch {
            logger.log('Failed to refresh.');
        }

        expect(result).not.toBeNull();
    });
});
