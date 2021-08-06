import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { LegalEntityAggregate } from '../../../aggregates/legal-entity.aggregate';
import { RegisterOrganizationCommand } from '../../../model/legal-entity/register-organization.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { AlreadyExistsException } from '../../error/already-exists-exception';

@CommandHandler(RegisterOrganizationCommand)
export class RegisterOrganizationCommandHandler implements ICommandHandler<RegisterOrganizationCommand> {
    constructor(private readonly publisher: EventPublisher, private readonly repository: LegalEntityRepository) {}

    async execute(command: RegisterOrganizationCommand): Promise<void> {
        let aggregate = await this.repository.get(command.legalEntityId);

        if (aggregate) {
            throw new AlreadyExistsException(command.legalEntityId);
        } else {
            aggregate = new LegalEntityAggregate(command.legalEntityId);
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.register(command.userId, command.name, command.website);
            aggregate.commit();
        }
    }
}
