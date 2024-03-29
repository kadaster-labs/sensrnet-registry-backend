import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { RemoveObservationGoalCommand } from '../../../model/observation-goal/remove-observation-goal.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { ObservationGoalRepository } from '../../../repositories/observation-goal.repository';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { validateLegalEntity } from '../../util/legal-entity.utils';

@CommandHandler(RemoveObservationGoalCommand)
export class RemoveObservationGoalCommandHandler implements ICommandHandler<RemoveObservationGoalCommand> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly repository: ObservationGoalRepository,
        private readonly legalEntityRepository: LegalEntityRepository,
    ) {}

    async execute(command: RemoveObservationGoalCommand): Promise<void> {
        if (command.legalEntityId) {
            await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
        } else {
            throw new NoLegalEntityException();
        }

        let aggregate = await this.repository.get(command.observationGoalId);
        if (aggregate) {
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.removeObservationGoal(command.legalEntityId);
            aggregate.commit();
        } else {
            throw new UnknowObjectException(command.observationGoalId);
        }
    }
}
