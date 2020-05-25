import { UpdateOwnerCommand } from "./update.command";
import { DeleteOwnerCommand } from "./delete.command";
import { OwnerRepository } from "../repositories/owner.repository";
import { UnknowOwnerException } from "../errors/unknow-owner-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(DeleteOwnerCommand)
export class DeleteOwnerCommandHandler
  implements ICommandHandler<UpdateOwnerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OwnerRepository
  ) {}

  async execute(command: UpdateOwnerCommand): Promise<void> {
    const ownerAggregate = await this.repository.get(command.id);

    if (!ownerAggregate) {
      throw new UnknowOwnerException(command.id);
    }

    const aggregate = this.publisher.mergeObjectContext(ownerAggregate);
    aggregate.delete();
    aggregate.commit();
  }
}
