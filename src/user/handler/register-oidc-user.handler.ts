import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { UserDoc, User } from '../user.model';
import { RegisterOidcUserCommand } from '../command/register-oidc-user.command';
import { UserAlreadyExistsException } from '../../command/handler/error/user-already-exists-exception';

@CommandHandler(RegisterOidcUserCommand)
export class RegisterOidcUserCommandHandler implements ICommandHandler<RegisterOidcUserCommand> {
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDoc>,
  ) {}

  async execute(command: RegisterOidcUserCommand): Promise<{ id: string }> {
    const userInstance = new this.userModel({
      _id: uuidv4(),
      email: command.token.preferred_username,
      oidc: command.token,
      role: 'user',
    });

    try {
      await userInstance.save();
      return { id: userInstance._id };
    } catch (error) {
      Logger.warn(error);
      throw new UserAlreadyExistsException("");
    }
  }
}
