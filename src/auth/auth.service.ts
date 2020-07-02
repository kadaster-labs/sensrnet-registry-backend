import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.interface';
import { UsersService } from '../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    private readonly accessTokenExpiresIn: number;
    private readonly refreshTokenExpiresIn: number;

    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {
        if (process.env.JWT_ACCESS_EXPIRES_IN) {
            this.accessTokenExpiresIn = Number(process.env.JWT_ACCESS_EXPIRES_IN);
        } else {
            this.accessTokenExpiresIn = 60 * 60 * 24;
        }

        if (process.env.JWT_REFRESH_EXPIRES_IN) {
            this.refreshTokenExpiresIn = Number(process.env.JWT_REFRESH_EXPIRES_IN);
        } else {
            this.refreshTokenExpiresIn = 60 * 60 * 24 * 7;
        }
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        let userDetails;
        if (user) {
            const pwdPromise = new Promise((resolve, reject) => user.checkPassword(pass, (err, isMatch) => {
                if (err) {
                    reject();
                } else {
                    if (isMatch) {
                        const userObject = {
                            _id: user._id,
                            role: user.role,
                            ownerId: user.ownerId,
                        };
                        resolve(userObject);
                    } else {
                        reject();
                    }
                }
            }));

            await pwdPromise.then((userObject) => {
                userDetails = userObject;
            }, () => {
                userDetails = null;
            });
        } else {
            userDetails = null;
        }

        return userDetails;
    }

    async refresh(reqUser, refreshToken) {
        const user = await this.usersService.findOne(reqUser.userId);

        let refreshTokenMatches;
        if (user) {
            const promise = new Promise((resolve, reject) => {
                user.checkRefreshToken(refreshToken, (err, isMatch) => {
                    if (err) {
                        reject();
                    } else {
                        if (isMatch) {
                            resolve();
                        } else {
                            reject();
                        }
                    }
                });
            });

            await promise.then(() => {
                refreshTokenMatches = true;
            }, () => {
                refreshTokenMatches = false;
            });
        } else {
            refreshTokenMatches = false;
        }

        if (refreshTokenMatches) {
            const accessPayload = { sub: user.ownerId, userId: user._id, role: user.role, type: 'access' };
            const accessToken = this.jwtService.sign(accessPayload, { expiresIn: this.accessTokenExpiresIn });
            return {
                access_token: accessToken,
                access_token_expires_in: this.accessTokenExpiresIn,
            };
        } else {
            throw new UnauthorizedException();
        }
    }

    async login(user: User) {
        const refreshPayload = { sub: user._id, role: user.role, type: 'refresh' };
        const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: this.refreshTokenExpiresIn });
        await this.usersService.updateOne(user._id, {refreshToken});

        const accessPayload = { sub: user.ownerId, userId: user._id, role: user.role, type: 'access' };
        const accessToken = this.jwtService.sign(accessPayload, { expiresIn: this.accessTokenExpiresIn });

        return {
            access_token: accessToken, access_token_expires_in: this.accessTokenExpiresIn,
            refresh_token: refreshToken, refresh_token_expires_in: this.refreshTokenExpiresIn,
        };
    }
}
