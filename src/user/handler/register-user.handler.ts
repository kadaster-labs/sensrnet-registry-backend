import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { UserDoc, User } from '../user.model';
import { RegisterUserCommand } from '../command/register-user.command';
import { UserAlreadyExistsException } from '../../command/handler/error/user-already-exists-exception';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDoc>,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const userInstance = new this.userModel({
      _id: uuidv4(),
      email: command.email,
      local: {
        password: command.password,
      },
      role: 'user',
    });

    const savePromise = new Promise((resolve, reject) => userInstance.save((err) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    }));

    let user = null;
    await savePromise.then(() => {
      user = { id: userInstance._id };
    }, () => {
      throw new UserAlreadyExistsException(command.email);
    });

    return user;
  }
}
