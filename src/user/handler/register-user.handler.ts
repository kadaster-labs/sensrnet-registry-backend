import { Model } from 'mongoose';
import { User } from '../user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../command/register-user.command';
import { UserAlreadyExistsException } from '../../command/handler/error/user-already-exists-exception';

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
