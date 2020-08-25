import { UnknowSensorException } from './error/unknow-sensor-exception';
import { ActivateSensorCommand } from '../model/activate-sensor.command';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(ActivateSensorCommand)
export class ActivateSensorCommandHandler implements ICommandHandler<ActivateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: ActivateSensorCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.sensorId);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);

    aggregate.activate(command.ownerId);
    aggregate.commit();
  }
}
