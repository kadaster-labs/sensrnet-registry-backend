import { CreateOwnerCommand } from "./create.command";
import { OwnerAggregate } from "../aggregates/owner.aggregate";
import { OwnerRepository } from "../repositories/owner.repository";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";
import { OwnerAlreadyExistsException } from "../errors/owner-already-exists-exception";


@CommandHandler(CreateOwnerCommand)
export class CreateOwnerCommandHandler implements ICommandHandler<CreateOwnerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OwnerRepository
  ) {}

  async execute(command: CreateOwnerCommand): Promise<void> {
    const aggregate = await this.repository.get(command.id);

    if (!!aggregate) {
      throw new OwnerAlreadyExistsException(command.id);
    } else {

      const ownerAggregate = new OwnerAggregate(command.id);
      const aggregate = this.publisher.mergeObjectContext(ownerAggregate);

      aggregate.create(command.nodeId, command.ssoId, command.email, command.publicName,
        command.name, command.companyName, command.website);
      aggregate.commit();
    }
  }
}
