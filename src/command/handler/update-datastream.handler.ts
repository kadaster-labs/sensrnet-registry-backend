import { UnknowSensorException } from './error/unknow-sensor-exception';
import { UpdateDatastreamCommand } from '../model/update-datastream.command';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateDatastreamCommand)
export class UpdateDataStreamCommandHandler implements ICommandHandler<UpdateDatastreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: UpdateDatastreamCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.sensorId);
    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.updateDataStream(command.organizationId, command.dataStreamId, command.name, command.reason, command.description,
        command.observedProperty, command.unitOfMeasurement, command.isPublic, command.isOpenData, command.isReusable,
        command.documentationUrl, command.dataLink, command.dataFrequency, command.dataQuality);
    aggregate.commit();
  }
}
