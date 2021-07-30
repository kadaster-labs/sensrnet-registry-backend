import { CommandBus } from '@nestjs/cqrs';
import { IUser } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { RegisterOidcUserCommand } from '../user/command/register-oidc-user.command';

@Injectable()
export class AuthService {

    protected logger: Logger = new Logger(this.constructor.name);

    constructor(
        private commandBus: CommandBus,
        private usersService: UserService,
    ) { }

    async createOrLogin(idToken: Record<string, any>): Promise<string> {
        let user: IUser = await this.usersService.findOne({ _id: idToken.sub });
        if (!user) {
            const userId: string = await this.commandBus.execute(new RegisterOidcUserCommand(idToken));
            this.logger.log(`Created new user ${JSON.stringify(userId)}`);
            user = await this.usersService.findOne({ _id: idToken.sub });
        }
        this.logger.debug(`login user: [${JSON.stringify(user.email)}]`);

        return user._id;
    }
}
