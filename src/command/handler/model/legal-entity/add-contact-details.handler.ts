import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddPublicContactDetailsCommand } from '../../../model/legal-entity/add-public-contact-details.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { UnknowObjectException } from '../../error/unknow-object-exception';

@CommandHandler(AddPublicContactDetailsCommand)
export class AddPublicContactDetailsCommandHandler implements ICommandHandler<AddPublicContactDetailsCommand> {
    constructor(private readonly publisher: EventPublisher, private readonly repository: LegalEntityRepository) {}

    async execute(command: AddPublicContactDetailsCommand): Promise<void> {
        let aggregate = await this.repository.get(command.legalEntityId);
        if (aggregate) {
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.addPublicContactDetails(command.contactDetailsId, command.name, command.email, command.phone);
            aggregate.commit();
        } else {
            throw new UnknowObjectException(command.legalEntityId);
        }
    }
}
