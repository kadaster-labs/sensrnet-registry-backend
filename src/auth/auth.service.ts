import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { User } from '../users/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    private readonly accessTokenExpiresIn: string;

    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {
        this.accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '24h';
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

    async login(user: User) {
        const payload = { sub: user.ownerId, userId: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            access_token_expires_in: this.accessTokenExpiresIn,
        };
    }
}
