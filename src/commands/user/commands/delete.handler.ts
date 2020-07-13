import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../users/user.interface';
import { DeleteUserCommand } from './delete.command';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteFailedException } from '../errors/delete-failed-exception';

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
