import { Model } from 'mongoose';
import { User } from '../user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../command/delete-user.command';
import { DeleteFailedException } from '../../command/handler/error/delete-failed-exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {

  constructor(
      @InjectModel('User') private userModel: Model<User>,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    this.userModel.deleteOne({_id: command.email}, {}, (err) => {
      if (err) {
        throw new DeleteFailedException(command.email);
      }
    });
  }
}
