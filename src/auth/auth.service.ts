import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { User } from '../users/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        let userDetails;
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
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
