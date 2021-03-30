import { IUser } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterOidcUserCommand } from '../user/command/register-oidc-user.command';

@Injectable()
export class AuthService {
    constructor(
        private commandBus: CommandBus,
        private usersService: UserService,
    ) { }

    async createOrLogin(reqUser: Record<string, any>): Promise<string> {
        let user: IUser = await this.usersService.findOne({ _id: reqUser.sub });
        if (!user) {
            const userId: string = await this.commandBus.execute(new RegisterOidcUserCommand(reqUser));
            Logger.log(`Created new user ${JSON.stringify(userId)}`);
            user = await this.usersService.findOne({ _id: reqUser.sub });
        }

        return user._id;
    }
}
