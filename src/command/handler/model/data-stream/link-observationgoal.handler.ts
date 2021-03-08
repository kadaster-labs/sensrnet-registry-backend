import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { validateLegalEntity } from '../../util/legal-entity.utils';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { LinkObservationGoalCommand } from '../../../command/data-stream/link-observationgoal.command';
import { ObservationGoalRepository } from '../../../../core/repositories/observation-goal.repository';

@CommandHandler(LinkObservationGoalCommand)
export class LinkObservationGoalCommandHandler implements ICommandHandler<LinkObservationGoalCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
    private readonly observationGoalRepository: ObservationGoalRepository,
  ) {}

  async execute(command: LinkObservationGoalCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    if (!await this.observationGoalRepository.get(command.observationGoalId)) {
      throw new UnknowObjectException(command.observationGoalId);
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.linkObservationGoal(command.sensorId, command.legalEntityId, command.dataStreamId,
          command.observationGoalId);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
