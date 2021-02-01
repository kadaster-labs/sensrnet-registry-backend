import { UnknowSensorException } from './error/unknow-sensor-exception';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { UpdateSensorLocationCommand } from '../model/update-sensor-location.command';
import { Logger } from '@nestjs/common';

@CommandHandler(UpdateSensorLocationCommand)
export class UpdateSensorLocationCommandHandler implements ICommandHandler<UpdateSensorLocationCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: UpdateSensorLocationCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.sensorId);
    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.relocate(command.organizationId, command.location, command.baseObjectId);
    aggregate.commit();
  }
}
