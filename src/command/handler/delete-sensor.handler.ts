import { DeleteSensorCommand } from '../model/delete-sensor.command';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { UnknowSensorException } from './error/unknow-sensor-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteSensorCommand)
export class DeleteSensorCommandHandler
  implements ICommandHandler<DeleteSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: DeleteSensorCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.sensorId);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.delete();
    aggregate.commit();
  }
}
