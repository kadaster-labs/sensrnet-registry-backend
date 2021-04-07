import { Model } from 'mongoose';
import { IUser } from '../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../command/delete-user.command';
import { DeleteFailedException } from '../../command/handler/error/delete-failed-exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {

  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
  ) { }

  async execute(command: DeleteUserCommand): Promise<void> {
    try {
      await this.userModel.deleteOne({ _id: command.id }, {});
    } catch (e) {
      throw new DeleteFailedException(command.id);
    }
  }
}
