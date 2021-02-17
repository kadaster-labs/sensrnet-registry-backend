import { DeleteSensorCommand } from '../../../command/sensor/delete-sensor.command';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { SensorRepository } from '../../../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteSensorCommand)
export class DeleteSensorCommandHandler
  implements ICommandHandler<DeleteSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: DeleteSensorCommand): Promise<void> {
    let aggregate = await this.repository.get(command.sensorId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.delete(command.legalEntityId);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.sensorId);
    }
  }
}
