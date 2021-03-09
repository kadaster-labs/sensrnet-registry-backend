import { UserService } from '../user/user.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterOidcUserCommand } from '../user/command/register-oidc-user.command';
import { UserDoc } from '../user/user.model';

@Injectable()
export class AuthService {
    constructor(
        private commandBus: CommandBus,
        private usersService: UserService,
    ) { }

    async createOrLogin(reqUser: Record<string, any>): Promise<string> {
        Logger.verbose(`Create or login OIDC user ${JSON.stringify(reqUser)}`);
        let user: UserDoc = await this.usersService.findOne(reqUser.sub);
        if (!user) {
            const userId: string = await this.commandBus.execute(new RegisterOidcUserCommand(reqUser));
            Logger.log(`Created new user ${JSON.stringify(userId)}`);
            user = await this.usersService.findOne(reqUser.sub);
        }

        return user._id;
    }
}
