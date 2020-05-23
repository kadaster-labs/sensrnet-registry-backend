import { UpdateCommand } from "./update.command";
import { DeleteCommand } from "./delete.command";
import { OwnerRepository } from "../repositories/owner.repository";
import { UnknowOwnerException } from "../errors/unknow-owner-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(DeleteCommand)
export class WithdrawCommandHandler
  implements ICommandHandler<UpdateCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OwnerRepository
  ) {}

  async execute(command: UpdateCommand): Promise<void> {
    const ownerAggregate = await this.repository.get(command.id);

    if (!ownerAggregate) {
      throw new UnknowOwnerException(command.id);
    }

    const aggregate = this.publisher.mergeObjectContext(ownerAggregate);
    aggregate.delete();
    aggregate.commit();
  }
}
