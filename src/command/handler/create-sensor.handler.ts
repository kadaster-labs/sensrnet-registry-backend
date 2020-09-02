import { validateOwner } from './util/owner.utils';
import { NoOwnerException } from './error/no-owner-exception';
import { CreateSensorCommand } from '../model/create-sensor.command';
import { SensorAggregate } from '../../core/aggregates/sensor.aggregate';
import { OwnerRepository } from '../../core/repositories/owner.repository';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { SensorAlreadyExistsException } from './error/sensor-already-exists-exception';

@CommandHandler(CreateSensorCommand)
export class CreateSensorCommandHandler implements ICommandHandler<CreateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly ownerRepository: OwnerRepository,
    private readonly sensorRepository: SensorRepository,
  ) {}

  async execute(command: CreateSensorCommand): Promise<void> {
    let aggregate: SensorAggregate;
    aggregate = await this.sensorRepository.get(command.sensorId);

    if (!command.ownerId) {
      throw new NoOwnerException();
    }

    if (!!aggregate) {
      throw new SensorAlreadyExistsException(command.sensorId);
    } else {
      await validateOwner(this.ownerRepository, command.ownerId);

      const sensorAggregate = new SensorAggregate(command.sensorId);
      aggregate = this.publisher.mergeObjectContext(sensorAggregate);

      aggregate.register(command.ownerId,
        command.name, command.location, command.dataStreams,
        command.aim, command.description, command.manufacturer,
        command.active, command.observationArea, command.documentationUrl,
        command.theme, command.typeName, command.typeDetails);
      aggregate.commit();
    }
  }
}
