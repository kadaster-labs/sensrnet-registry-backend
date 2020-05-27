import { DeleteOwnerCommand } from "./delete.command";
import { OwnerRepository } from "../repositories/owner.repository";
import { UnknowOwnerException } from "../errors/unknow-owner-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(DeleteOwnerCommand)
export class DeleteOwnerCommandHandler
  implements ICommandHandler<DeleteOwnerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OwnerRepository
  ) {}

  async execute(command: DeleteOwnerCommand): Promise<void> {
    const ownerAggregate = await this.repository.get(command.ownerId);

    if (!ownerAggregate) {
      throw new UnknowOwnerException(command.ownerId);
    }

    const aggregate = this.publisher.mergeObjectContext(ownerAggregate);
    aggregate.delete();
    aggregate.commit();
  }
}
