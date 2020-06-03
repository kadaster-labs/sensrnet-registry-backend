import { SensorRepository } from '../repositories/sensor.repository';
import { TransferSensorOwnershipCommand } from './transferownership.command';
import { UnknowSensorException } from '../errors/unknow-sensor-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import {OwnerRepository} from '../../owner/repositories/owner.repository';
import {NonExistingOwnerException} from '../errors/non-existing-owner-exception';

@CommandHandler(TransferSensorOwnershipCommand)
export class TransferSensorOwnershipCommandHandler implements ICommandHandler<TransferSensorOwnershipCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly sensorRepository: SensorRepository,
    private readonly ownerRepository: OwnerRepository,
  ) {}

  async execute(command: TransferSensorOwnershipCommand): Promise<void> {
    const sensorAggregate = await this.sensorRepository.get(command.sensorId);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    if (!await this.ownerRepository.get(command.oldOwnerId)) {
      throw new NonExistingOwnerException(command.oldOwnerId);
    } else if (!await this.ownerRepository.get(command.newOwnerId)) {
      throw new NonExistingOwnerException(command.newOwnerId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.transferOwnership(command.oldOwnerId, command.newOwnerId);
    aggregate.commit();
  }
}
