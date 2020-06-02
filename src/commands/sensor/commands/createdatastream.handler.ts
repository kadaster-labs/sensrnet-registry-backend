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
    const sensorAggregate = await this.repository.get(command.sensorId);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.addDatastream(command.dataStreamId, command.name, command.reason, command.description, 
      command.observedProperty, command.unitOfMeasurement, command.isPublic, command.isOpenData, command.isReusable, 
      command.documentationUrl, command.dataLink, command.dataFrequency, command.dataQuality);
    aggregate.commit();
  }
}
