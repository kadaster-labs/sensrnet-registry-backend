import { UpdateSensorCommand } from "./update.command";
import { SensorRepository } from "../repositories/sensor.repository";
import { UnknowSensorException } from "../errors/unknow-sensor-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(UpdateSensorCommand)
export class UpdateSensorCommandHandler implements ICommandHandler<UpdateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository
  ) {}

  async execute(command: UpdateSensorCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.id);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.id);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.update(command.name, command.aim, command.description, command.manufacturer, 
      command.observationArea, command.documentationUrl, command.category, command.theme,
      command.typeName, command.typeDetails);
    aggregate.commit();
  }
}
