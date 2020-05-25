import { CreateDataStreamCommand } from "./createdatastream.command";
import { SensorRepository } from "../repositories/sensor.repository";
import { UnknowSensorException } from "../errors/unknow-sensor-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(CreateDataStreamCommand)
export class CreateDataStreamCommandHandler implements ICommandHandler<CreateDataStreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository
  ) {}

  async execute(command: CreateDataStreamCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.id);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.id);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.createDataStream(command.name);
    aggregate.commit();
  }
}
