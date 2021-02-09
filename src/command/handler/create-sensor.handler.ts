import { validateOrganization } from './util/organization.utils';
import { CreateSensorCommand } from '../model/create-sensor.command';
import { SensorAggregate } from '../../core/aggregates/sensor.aggregate';
import { OrganizationRepository } from '../../core/repositories/organization.repository';
import { NoOrganizationException } from './error/no-organization-exception';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { SensorAlreadyExistsException } from './error/sensor-already-exists-exception';

@CommandHandler(CreateSensorCommand)
export class CreateSensorCommandHandler implements ICommandHandler<CreateSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly sensorRepository: SensorRepository,
    private readonly ownerRepository: OrganizationRepository,
  ) {}

  async execute(command: CreateSensorCommand): Promise<void> {
    let aggregate: SensorAggregate;
    aggregate = await this.sensorRepository.get(command.sensorId);
    if (!command.organizationId) {
      throw new NoOrganizationException();
    }

    if (!!aggregate) {
      throw new SensorAlreadyExistsException(command.sensorId);
    } else {
      await validateOrganization(this.ownerRepository, command.organizationId);

      const sensorAggregate = new SensorAggregate(command.sensorId);
      aggregate = this.publisher.mergeObjectContext(sensorAggregate);

      aggregate.register(command.organizationId, command.name, command.location, command.baseObjectId,
          command.dataStreams, command.aim, command.description, command.manufacturer, command.active,
          command.observationArea, command.documentationUrl, command.theme, command.category, command.typeName,
          command.typeDetails);
      aggregate.commit();
    }
  }
}
