import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { RemoveLegalEntityCommand } from '../../../model/legal-entity/remove-legal-entity.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { UnknowObjectException } from '../../error/unknow-object-exception';

@CommandHandler(RemoveLegalEntityCommand)
export class RemoveLegalEntityCommandHandler implements ICommandHandler<RemoveLegalEntityCommand> {
    constructor(private readonly publisher: EventPublisher, private readonly repository: LegalEntityRepository) {}

    async execute(command: RemoveLegalEntityCommand): Promise<void> {
        let aggregate = await this.repository.get(command.id);
        if (aggregate) {
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.remove();
            aggregate.commit();
        } else {
            throw new UnknowObjectException(command.id);
        }
    }
}
