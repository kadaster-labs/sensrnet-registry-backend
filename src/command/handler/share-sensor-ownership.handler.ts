import { validateOrganization } from './util/organization.utils';
import { UnknowSensorException } from './error/unknow-sensor-exception';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { ShareSensorOwnershipCommand } from '../model/share-sensor-ownership.command';
import { OrganizationRepository } from '../../core/repositories/organization-repository.service';

@CommandHandler(ShareSensorOwnershipCommand)
export class ShareSensorOwnershipCommandHandler implements ICommandHandler<ShareSensorOwnershipCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly sensorRepository: SensorRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(command: ShareSensorOwnershipCommand): Promise<void> {
    const sensorAggregate = await this.sensorRepository.get(command.sensorId);
    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    await validateOrganization(this.organizationRepository, command.newOrganizationId);

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.shareOwnership(command.organizationId, command.newOrganizationId);
    aggregate.commit();
  }
}
