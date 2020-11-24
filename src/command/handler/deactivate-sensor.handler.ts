import { UnknowSensorException } from './error/unknow-sensor-exception';
import { DeactivateSensorCommand } from '../model/deactivate-sensor.command';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeactivateSensorCommand)
export class DeactivateSensorCommandHandler implements ICommandHandler<DeactivateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: DeactivateSensorCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.sensorId);
    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.deactivate(command.organizationId);
    aggregate.commit();
  }
}
