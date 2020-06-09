import { ShareSensorOwnershipCommand } from './shareownership.command';
import { SensorRepository } from '../repositories/sensor.repository';
import { UnknowSensorException } from '../errors/unknow-sensor-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import {OwnerRepository} from '../../owner/repositories/owner.repository';
import {validateOwner} from '../utils/owner.utils';

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
