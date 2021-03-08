import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { validateLegalEntity } from '../../util/legal-entity.utils';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { UnlinkObservationGoalCommand } from '../../../command/data-stream/unlink-observationgoal.command';

@CommandHandler(UnlinkObservationGoalCommand)
export class UnlinkObservationGoalCommandHandler implements ICommandHandler<UnlinkObservationGoalCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: UnlinkObservationGoalCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.unlinkObservationGoal(command.sensorId, command.legalEntityId, command.dataStreamId,
          command.observationGoalId);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
