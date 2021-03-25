import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    public readonly accessTokenExpiresIn: number;
    public readonly refreshTokenExpiresIn: number;

    constructor(
        private jwtService: JwtService,
        private usersService: UserService,
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

    public async verifyToken(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token);
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne({email});

        let userDetails;
        if (user) {
            const pwdPromise = new Promise((resolve, reject) => user.checkPassword(password, async (err, isMatch) => {
                if (err) {
                    reject();
                } else {
                    if (isMatch) {
                        resolve({_id: user._id});
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

    async refresh(reqUser: Record<string, any>, refreshToken: string): Promise<Record<string, string>> {
        const user = await this.usersService.findOne({_id: reqUser.userId});

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
            const accessPayload = { sub: user._id, type: 'access' };
            const accessToken = this.jwtService.sign(accessPayload, {expiresIn: this.accessTokenExpiresIn});
            return { accessToken };
        } else {
            throw new UnauthorizedException();
        }
    }

    async login(user: Record<string, any>): Promise<Record<string, any>> {
        const refreshPayload = { sub: user._id, role: user.role, type: 'refresh' };
        const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: this.refreshTokenExpiresIn });
        await this.usersService.updateOne(user._id, { refreshToken });

        const accessPayload = { sub: user._id, role: user.role, type: 'access' };
        const accessToken = this.jwtService.sign(accessPayload, { expiresIn: this.accessTokenExpiresIn });

        return { accessToken, refreshToken };
    }
}
