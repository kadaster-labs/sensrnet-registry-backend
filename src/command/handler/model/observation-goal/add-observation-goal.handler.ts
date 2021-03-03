import { UnknowObjectException } from '../../error/unknow-object-exception';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { AddObservationGoalCommand } from '../../../command/observation-goal/add-observation-goal.command';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { validateLegalEntity } from '../../util/legal-entity.utils';

@CommandHandler(AddObservationGoalCommand)
export class AddObservationGoalCommandHandler implements ICommandHandler<AddObservationGoalCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: AddObservationGoalCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.addObservationGoal(command.dataStreamId, command.observationGoalId, command.legalEntityId,
          command.name, command.description, command.legalGround, command.legalGroundLink);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
