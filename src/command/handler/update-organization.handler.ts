import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { UpdateOrganizationCommand } from '../model/update-organization.command';
import { UnknowOrganizationException } from './error/unknow-organization-exception';
import { OrganizationRepository } from '../../core/repositories/organization.repository';

@CommandHandler(UpdateOrganizationCommand)
export class UpdateOrganizationCommandHandler implements ICommandHandler<UpdateOrganizationCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: UpdateOrganizationCommand): Promise<void> {
    const organizationAggregate = await this.repository.get(command.organizationId);
    if (!organizationAggregate) {
      throw new UnknowOrganizationException(command.organizationId);
    }

    const aggregate = this.publisher.mergeObjectContext(organizationAggregate);
    aggregate.update(command.website, command.contactName, command.contactEmail, command.contactPhone);
    aggregate.commit();
  }
}
