import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { ObservationGoalAggregate } from '../../../aggregates/observation-goal.aggregate';
import { RegisterObservationGoalCommand } from '../../../model/observation-goal/register-observation-goal.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { ObservationGoalRepository } from '../../../repositories/observation-goal.repository';
import { AlreadyExistsException } from '../../error/already-exists-exception';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { validateLegalEntity } from '../../util/legal-entity.utils';

@CommandHandler(RegisterObservationGoalCommand)
export class RegisterObservationGoalCommandHandler implements ICommandHandler<RegisterObservationGoalCommand> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly repository: ObservationGoalRepository,
        private readonly legalEntityRepository: LegalEntityRepository,
    ) {}

    async execute(command: RegisterObservationGoalCommand): Promise<void> {
        if (command.legalEntityId) {
            await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
        } else {
            throw new NoLegalEntityException();
        }

        let aggregate = await this.repository.get(command.observationGoalId);
        if (aggregate) {
            throw new AlreadyExistsException(command.observationGoalId);
        } else {
            aggregate = new ObservationGoalAggregate(command.observationGoalId);
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.registerObservationGoal(
                command.legalEntityId,
                command.name,
                command.description,
                command.legalGround,
                command.legalGroundLink,
            );
            aggregate.commit();
        }
    }
}
