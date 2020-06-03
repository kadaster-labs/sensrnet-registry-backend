import { CreateSensorCommand } from './create.command';
import { SensorAggregate } from '../aggregates/sensor.aggregate';
import { SensorRepository } from '../repositories/sensor.repository';
import { OwnerRepository } from '../../owner/repositories/owner.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { OwnerNotExistsException } from '../errors/owner-not-exists-exception';
import { SensorAlreadyExistsException } from '../errors/sensor-already-exists-exception';

@CommandHandler(CreateSensorCommand)
export class CreateSensorCommandHandler implements ICommandHandler<CreateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly sensorRepository: SensorRepository,
    private readonly ownerRepository: OwnerRepository,
  ) {}

  async execute(command: CreateSensorCommand): Promise<void> {
    let aggregate: SensorAggregate;
    aggregate = await this.sensorRepository.get(command.sensorId);

    if (!!aggregate) {
      throw new SensorAlreadyExistsException(command.sensorId);
    } else {
      for (const ownerId of command.ownerIds) {
        if (!await this.ownerRepository.get(ownerId)) {
          throw new OwnerNotExistsException(ownerId);
        }
      }
      const sensorAggregate = new SensorAggregate(command.sensorId);
      aggregate = this.publisher.mergeObjectContext(sensorAggregate);

      aggregate.register(command.nodeId, command.ownerIds,
        command.name, command.location, command.dataStreams,
        command.aim, command.description, command.manufacturer,
        command.active, command.observationArea, command.documentationUrl,
        command.theme, command.typeName, command.typeDetails);
      aggregate.commit();
    }
  }
}
