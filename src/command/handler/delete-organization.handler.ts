import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeleteOrganizationCommand } from '../model/delete-organization.command';
import { UnknowOrganizationException } from './error/unknow-organization-exception';
import { OrganizationRepository } from '../../core/repositories/organization.repository';

@CommandHandler(DeleteOrganizationCommand)
export class DeleteOrganizationCommandHandler implements ICommandHandler<DeleteOrganizationCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: DeleteOrganizationCommand): Promise<void> {
    const organizationAggregate = await this.repository.get(command.organizationId);
    if (!organizationAggregate) {
      throw new UnknowOrganizationException(command.organizationId);
    }

    const aggregate = this.publisher.mergeObjectContext(organizationAggregate);
    aggregate.delete();
    aggregate.commit();
  }
}
