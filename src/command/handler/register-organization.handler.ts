import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { OrganizationAggregate } from '../../core/aggregates/organization.aggregate';
import { RegisterOrganizationCommand } from '../model/register-organization.command';
import { OrganizationRepository } from '../../core/repositories/organization-repository.service';
import { OrganizationAlreadyExistsException } from './error/organization-already-exists-exception';

@CommandHandler(RegisterOrganizationCommand)
export class RegisterOrganizationCommandHandler implements ICommandHandler<RegisterOrganizationCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: RegisterOrganizationCommand): Promise<void> {
    let aggregate: OrganizationAggregate;
    aggregate = await this.repository.get(command.organizationId);

    if (!!aggregate) {
      throw new OrganizationAlreadyExistsException(command.organizationId);
    } else {
      const organizationAggregate = new OrganizationAggregate(command.organizationId);
      aggregate = this.publisher.mergeObjectContext(organizationAggregate);

      aggregate.register(command.website, command.contactName, command.contactEmail, command.contactPhone);
      aggregate.commit();
    }
  }
}
