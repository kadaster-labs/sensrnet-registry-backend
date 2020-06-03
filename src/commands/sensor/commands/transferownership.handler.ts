import { SensorRepository } from '../repositories/sensor.repository';
import { TransferSensorOwnershipCommand } from './transferownership.command';
import { UnknowSensorException } from '../errors/unknow-sensor-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import {OwnerRepository} from '../../owner/repositories/owner.repository';
import {OwnerNotExistsException} from '../errors/owner-not-exists-exception';

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
      throw new OwnerNotExistsException(command.oldOwnerId);
    } else if (!await this.ownerRepository.get(command.newOwnerId)) {
      throw new OwnerNotExistsException(command.newOwnerId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.transferOwnership(command.oldOwnerId, command.newOwnerId);
    aggregate.commit();
  }
}
