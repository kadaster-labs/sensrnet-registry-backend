import { validateOwner } from './util/owner.utils';
import { UnknowSensorException } from './error/unknow-sensor-exception';
import { OwnerRepository } from '../../core/repositories/owner.repository';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { TransferSensorOwnershipCommand } from '../model/transfer-sensor-ownership.command';

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
