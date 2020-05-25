import { ActivateSensorCommand } from "./activate.command";
import { SensorRepository } from "../repositories/sensor.repository";
import { UnknowSensorException } from "../errors/unknow-sensor-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(ActivateSensorCommand)
export class ActivateSensorCommandHandler implements ICommandHandler<ActivateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository
  ) {}

  async execute(command: ActivateSensorCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.id);
    
    if (!sensorAggregate) {
      throw new UnknowSensorException(command.id);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);

    aggregate.activate();
    aggregate.commit();
  }
}
