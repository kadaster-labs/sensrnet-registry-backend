import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterOidcUserCommand } from '../commons/commands/register-oidc-user.command';
import { UserQueryService } from '../commons/user/user.qry-service';
import { IUser } from '../commons/user/user.schema';

@Injectable()
export class AuthService {
    protected logger: Logger = new Logger(this.constructor.name);

    constructor(private commandBus: CommandBus, private userQryService: UserQueryService) {}

    async createOrLogin(idToken: Record<string, any>): Promise<string> {
        const user: IUser = await this.userQryService.retrieveUser(idToken.sub).then(async localScopeUser => {
            if (!localScopeUser) {
                await this.postRegisterCommand(idToken);
                return this.userQryService.retrieveUser(idToken.sub);
            }
            return localScopeUser;
        });

        this.logger.verbose(`successful login user: [${JSON.stringify(user._id)}]`);
        return user._id;
    }

    private async postRegisterCommand(idToken: Record<string, any>) {
        await this.commandBus.execute(new RegisterOidcUserCommand(idToken.sub, idToken.email, idToken));
    }
}
