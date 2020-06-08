import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        let result;
        if (user) {
            const pwdPromise = new Promise((resolve, reject) => user.checkPassword(pass, (err, isMatch) => {
                if (err) {
                    reject();
                } else {
                    if (isMatch) {
                        resolve({_id: user._id, username: user.username});
                    } else {
                        reject();
                    }
                }
            }));

            await pwdPromise.then((userObject) => {
                result = userObject;
            }, () => {
                result = null;
            });
        } else {
            result = null;
        }

        return result;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
