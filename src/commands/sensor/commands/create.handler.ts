import { CreateSensorCommand } from "./create.command";
import { SensorAggregate } from "../aggregates/sensor.aggregate";
import { SensorRepository } from "../repositories/sensor.repository";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";
import { SensorAlreadyExistsException } from "../errors/sensor-already-exists-exception";


@CommandHandler(CreateSensorCommand)
export class CreateSensorCommandHandler implements ICommandHandler<CreateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository
  ) {}

  async execute(command: CreateSensorCommand): Promise<void> {
    const aggregate = await this.repository.get(command.id);

    if (!!aggregate) {
      throw new SensorAlreadyExistsException(command.id);
    } else {
      const sensorAggregate = new SensorAggregate(command.id);
      const aggregate = this.publisher.mergeObjectContext(sensorAggregate);

      aggregate.create(command.nodeId, command.ownerIds,
        command.name, command.location, command.dataStreams,
        command.aim, command.description, command.manufacturer,
        command.active, command.observationArea, command.documentationUrl,
        command.category, command.theme, command.typeName, command.typeDetails);
      aggregate.commit();
    }
  }
}
