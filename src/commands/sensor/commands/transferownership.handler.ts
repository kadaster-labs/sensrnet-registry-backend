import { validateOwner } from '../utils/owner.utils';
import { SensorRepository } from '../repositories/sensor.repository';
import { UnknowSensorException } from '../errors/unknow-sensor-exception';
import { OwnerRepository } from '../../owner/repositories/owner.repository';
import { TransferSensorOwnershipCommand } from './transferownership.command';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(TransferSensorOwnershipCommand)
export class TransferSensorOwnershipCommandHandler implements ICommandHandler<TransferSensorOwnershipCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly ownerRepository: OwnerRepository,
    private readonly sensorRepository: SensorRepository,
  ) {}

  async execute(command: TransferSensorOwnershipCommand): Promise<void> {
    const sensorAggregate = await this.sensorRepository.get(command.sensorId);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    if (!await this.ownerRepository.get(command.oldOwnerId)) {
      await validateOwner(this.ownerRepository, command.oldOwnerId);
    } else if (!await this.ownerRepository.get(command.newOwnerId)) {
      await validateOwner(this.ownerRepository, command.newOwnerId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.transferOwnership(command.oldOwnerId, command.newOwnerId);
    aggregate.commit();
  }
}
