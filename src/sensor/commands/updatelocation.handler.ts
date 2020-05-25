import { UpdateSensorLocationCommand } from "./updatelocation.command";
import { SensorRepository } from "../repositories/sensor.repository";
import { UnknowSensorException } from "../errors/unknow-sensor-exception";
import { ICommandHandler, EventPublisher, CommandHandler } from "@nestjs/cqrs";


@CommandHandler(UpdateSensorLocationCommand)
export class UpdateSensorLocationCommandHandler implements ICommandHandler<UpdateSensorLocationCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SensorRepository
  ) {}

  async execute(command: UpdateSensorLocationCommand): Promise<void> {
    const sensorAggregate = await this.repository.get(command.id);

    if (!sensorAggregate) {
      throw new UnknowSensorException(command.id);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.updateLocation(command.lat, command.lon, command.height, command.baseObjectId);
    aggregate.commit();
  }
}
