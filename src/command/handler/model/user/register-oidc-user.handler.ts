import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/command/repositories/user.service';
import { RegisterOidcUserCommand } from '../../../../commons/commands/register-oidc-user.command';
import { IUser } from '../../../../commons/user/user.schema';
import { UserAlreadyExistsException } from '../../error/user-already-exists-exception';

@CommandHandler(RegisterOidcUserCommand)
export class RegisterOidcUserCommandHandler implements ICommandHandler<RegisterOidcUserCommand> {

  protected logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly userService: UserService,
  ) { }

  async execute(command: RegisterOidcUserCommand) {
    await this.userService.saveUser(command.id, command.email, command.oidc);
  }
}
