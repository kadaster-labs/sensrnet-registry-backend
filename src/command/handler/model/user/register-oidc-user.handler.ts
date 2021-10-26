import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterOidcUserCommand } from '../../../../commons/commands/register-oidc-user.command';
import { UserService } from '../../../repositories/user.service';

@CommandHandler(RegisterOidcUserCommand)
export class RegisterOidcUserCommandHandler implements ICommandHandler<RegisterOidcUserCommand> {
    protected logger: Logger = new Logger(this.constructor.name);

    constructor(private readonly userService: UserService) {}

    async execute(command: RegisterOidcUserCommand): Promise<void> {
        await this.userService.saveUser(command.id, command.email, command.oidc);
    }
}
