import { validateLegalEntity } from '../../util/legal-entity.utils';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { ObservationGoalRepository } from '../../../../core/repositories/observation-goal.repository';
import { RegisterObservationGoalCommand } from '../../../command/observation-goal/register-observation-goal.command';
import { AlreadyExistsException } from '../../error/already-exists-exception';
import { ObservationGoalAggregate } from '../../../../core/aggregates/observation-goal.aggregate';

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

      aggregate.registerObservationGoal(command.legalEntityId, command.name, command.description, command.legalGround,
          command.legalGroundLink);
      aggregate.commit();
    }
  }
}
