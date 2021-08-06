import { Model } from 'mongoose';

import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { IUser } from '../model/user.model';
import { RegisterOidcUserCommand } from '../command/register-oidc-user.command';
import { UserAlreadyExistsException } from '../../command/handler/error/user-already-exists-exception';

@CommandHandler(RegisterOidcUserCommand)
export class RegisterOidcUserCommandHandler implements ICommandHandler<RegisterOidcUserCommand> {

  protected logger: Logger = new Logger(this.constructor.name);

  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
  ) { }

  async execute(command: RegisterOidcUserCommand): Promise<{ id: string }> {
    this.logger.log('Going to register user');
    const userInstance = new this.userModel({
      _id: command.token.sub,
      email: command.token.email,
      oidc: command.token,
      role: 'user',
    });

    try {
      await userInstance.save();
      this.logger.log('User Created in DB');
      return { id: userInstance._id };
    } catch (error) {
      this.logger.warn(error);
      throw new UserAlreadyExistsException("");
    }
  }
}
