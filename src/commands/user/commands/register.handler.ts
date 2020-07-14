import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../users/user.interface';
import { RegisterUserCommand } from './register.command';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UserAlreadyExistsException } from '../../owner/errors/user-already-exists-exception';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {

  constructor(
      @InjectModel('User') private userModel: Model<User>,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const userInstance = new this.userModel({
      role: 'user',
      _id: command.email,
      ownerId: command.ownerId,
      password: command.password,
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
      user = {id: userInstance._id};
    }, () => {
      throw new UserAlreadyExistsException(command.email);
    });

    return user;
  }
}
