import { UpdateCommand } from "./update.command";
import { OwnerRepository } from "../repositories/owner.repository";
import { UnknowOwnerException } from "../errors/unknow-owner-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
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
    aggregate.update(command.ssoId, command.email, command.publicName,
      command.name, command.companyName, command.website);
    aggregate.commit();
  }
}
