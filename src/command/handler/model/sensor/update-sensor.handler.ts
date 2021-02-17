import { UpdateSensorCommand } from '../../../command/sensor/update-sensor.command';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { SensorRepository } from '../../../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateSensorCommand)
export class UpdateSensorCommandHandler implements ICommandHandler<UpdateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: UpdateSensorCommand): Promise<void> {
    let aggregate = await this.repository.get(command.sensorId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.update(command.legalEntityId, command.name, command.description, command.supplier,
          command.manufacturer, command.documentationUrl, command.active);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.sensorId);
    }
  }
}
