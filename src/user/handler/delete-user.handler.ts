import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../command/delete-user.command';
import { DeleteFailedException } from '../../command/handler/error/delete-failed-exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async execute(command: DeleteUserCommand): Promise<void> {
    try {
      await this.userModel.deleteOne({ _id: command.id }, {});
    } catch (e) {
      throw new DeleteFailedException(command.id);
    }
  }
}
