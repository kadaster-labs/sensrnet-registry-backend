import { Model } from 'mongoose';

import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { User, UserDocument } from '../schema/user.schema';
import { RegisterOidcUserCommand } from '../command/register-oidc-user.command';
import { UserAlreadyExistsException } from '../../command/handler/error/user-already-exists-exception';

@CommandHandler(RegisterOidcUserCommand)
export class RegisterOidcUserCommandHandler implements ICommandHandler<RegisterOidcUserCommand> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async execute(command: RegisterOidcUserCommand): Promise<{ id: string }> {
    Logger.log('Going to register user');
    const userInstance = new this.userModel({
      _id: command.token.sub,
      email: command.token.email,
      oidc: command.token,
      role: 'user',
    });

    try {
      await userInstance.save();
      Logger.log('User Created in DB');
      return { id: userInstance._id };
    } catch (error) {
      Logger.warn(error);
      throw new UserAlreadyExistsException("");
    }
  }
}
