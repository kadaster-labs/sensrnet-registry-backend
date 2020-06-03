import { SensorRepository } from '../repositories/sensor.repository';
import { TransferSensorOwnershipCommand } from './transferownership.command';
import { UnknowSensorException } from '../errors/unknow-sensor-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(TransferSensorOwnershipCommand)
export class TransferSensorOwnershipCommandHandler implements ICommandHandler<TransferSensorOwnershipCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: TransferSensorOwnershipCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.sensorId);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.transferOwnership(command.oldOwnerId, command.newOwnerId);
    aggregate.commit();
  }
}
