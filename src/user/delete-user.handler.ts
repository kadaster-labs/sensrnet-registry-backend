import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.interface';
import { DeleteUserCommand } from '../command/model/delete-user.command';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteFailedException } from '../command/handler/error/delete-failed-exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {

  constructor(
      @InjectModel('User') private userModel: Model<User>,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    this.userModel.deleteOne({_id: command.email}, (err) => {
      if (err) {
        throw new DeleteFailedException(command.email);
      }
    });
  }
}
