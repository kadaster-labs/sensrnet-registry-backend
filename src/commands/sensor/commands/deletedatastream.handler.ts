import { DeleteDataStreamCommand } from "./deletedatastream.command";
import { SensorRepository } from "../repositories/sensor.repository";
import { UnknowSensorException } from "../errors/unknow-sensor-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(DeleteDataStreamCommand)
export class DeleteDataStreamCommandHandler implements ICommandHandler<DeleteDataStreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository
  ) {}

  async execute(command: DeleteDataStreamCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.id);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.id);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.deleteDataStream(command.id, command.dataStreamId);
    aggregate.commit();
  }
}
