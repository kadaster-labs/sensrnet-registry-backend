import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterOidcUserCommand } from '../user/command/register-oidc-user.command';
import { UserDoc } from '../user/user.model';
import { UserToken } from './models/user-token';

@Injectable()
export class AuthService {
    constructor(
        private commandBus: CommandBus,
        private jwtService: JwtService,
        private usersService: UserService,
    ) { }

    public async verifyToken(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token);
    }

    async createOrLogin(reqUser: UserToken): Promise<string> {
        Logger.verbose(`Create or login OIDC user ${JSON.stringify(reqUser)}`);
        let user: UserDoc = await this.usersService.findOne(reqUser.userinfo.sub);
        if (!user) {
            const userId: string = await this.commandBus.execute(new RegisterOidcUserCommand(reqUser));
            Logger.log(`Created new user ${JSON.stringify(userId)}`);
            user = await this.usersService.findOne(reqUser.userinfo.sub);
        }

        return user._id;
    }
}
