import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { UpdateObservationGoalCommand } from '../../../command/observation-goal/update-observation-goal.command';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { validateLegalEntity } from '../../util/legal-entity.utils';
import { ObservationGoalRepository } from '../../../../core/repositories/observation-goal.repository';

@CommandHandler(UpdateObservationGoalCommand)
export class UpdateObservationGoalCommandHandler implements ICommandHandler<UpdateObservationGoalCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: ObservationGoalRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: UpdateObservationGoalCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.observationGoalId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.updateObservationGoal(command.legalEntityId, command.name, command.description, command.legalGround,
          command.legalGroundLink);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.observationGoalId);
    }
  }
}
