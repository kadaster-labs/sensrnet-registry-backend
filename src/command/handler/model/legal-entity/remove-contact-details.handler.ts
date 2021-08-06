import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RemoveContactDetailsCommand } from '../../../model/legal-entity/remove-contact-details.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { UnknowObjectException } from '../../error/unknow-object-exception';

@CommandHandler(RemoveContactDetailsCommand)
export class RemoveContactDetailsCommandHandler implements ICommandHandler<RemoveContactDetailsCommand> {
    constructor(private readonly publisher: EventPublisher, private readonly repository: LegalEntityRepository) {}

    async execute(command: RemoveContactDetailsCommand): Promise<void> {
        let aggregate = await this.repository.get(command.legalEntityId);
        if (aggregate) {
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.removeContactDetails(command.contactDetailsId);
            aggregate.commit();
        } else {
            throw new UnknowObjectException(command.legalEntityId);
        }
    }
}
