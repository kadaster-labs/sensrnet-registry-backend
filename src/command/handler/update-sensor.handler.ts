import { UpdateSensorCommand } from '../model/update-sensor.command';
import { UnknowSensorException } from './error/unknow-sensor-exception';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateSensorCommand)
export class UpdateSensorCommandHandler implements ICommandHandler<UpdateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: UpdateSensorCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.sensorId);
    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.update(command.organizationId, command.name, command.aim, command.description,
        command.manufacturer, command.observationArea, command.documentationUrl, command.theme,
        command.category, command.typeName, command.typeDetails);
    aggregate.commit();
  }
}
