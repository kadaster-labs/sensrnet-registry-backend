import { UnknowSensorException } from './error/unknow-sensor-exception';
import { DeleteDatastreamCommand } from '../model/delete-datastream.command';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteDatastreamCommand)
export class DeleteDataStreamCommandHandler implements ICommandHandler<DeleteDatastreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository,
  ) {}

  async execute(command: DeleteDatastreamCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.sensorId);
    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.deleteDataStream(command.organizationId, command.dataStreamId);
    aggregate.commit();
  }
}
