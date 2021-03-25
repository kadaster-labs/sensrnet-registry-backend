import { Model } from 'mongoose';
import { IUser } from '../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../command/register-user.command';
import { UserAlreadyExistsException } from '../../command/handler/error/user-already-exists-exception';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
      @InjectModel('User') private userModel: Model<IUser>,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const userInstance = new this.userModel({
      _id: command.id,
      email: command.email,
      password: command.password,
    });

    let userDetails;
    try {
      await userInstance.save();
      userDetails = { id: userInstance._id };
    } catch (e) {
      throw new UserAlreadyExistsException(command.email);
    }

    return userDetails;
  }
}
