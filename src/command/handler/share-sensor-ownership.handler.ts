import { validateOwner } from './util/owner.utils';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ShareSensorOwnershipCommand } from '../model/share-sensor-ownership.command';
import { UnknowSensorException } from './error/unknow-sensor-exception';
import { OwnerRepository } from '../../core/repositories/owner.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(ShareSensorOwnershipCommand)
export class ShareSensorOwnershipCommandHandler implements ICommandHandler<ShareSensorOwnershipCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly sensorRepository: SensorRepository,
    private readonly ownerRepository: OwnerRepository,
  ) {}

  async execute(command: ShareSensorOwnershipCommand): Promise<void> {
    const sensorAggregate = await this.sensorRepository.get(command.sensorId);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    for (const ownerId of command.ownerIds) {
      await validateOwner(this.ownerRepository, ownerId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.shareOwnership(command.ownerIds);
    aggregate.commit();
  }
}
