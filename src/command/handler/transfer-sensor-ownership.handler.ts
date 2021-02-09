import { validateOrganization } from './util/organization.utils';
import { UnknowSensorException } from './error/unknow-sensor-exception';
import { SensorRepository } from '../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { TransferSensorOwnershipCommand } from '../model/transfer-sensor-ownership.command';
import { OrganizationRepository } from '../../core/repositories/organization.repository';

@CommandHandler(TransferSensorOwnershipCommand)
export class TransferSensorOwnershipCommandHandler implements ICommandHandler<TransferSensorOwnershipCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly sensorRepository: SensorRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(command: TransferSensorOwnershipCommand): Promise<void> {
    const sensorAggregate = await this.sensorRepository.get(command.sensorId);
    if (!sensorAggregate) {
      throw new UnknowSensorException(command.sensorId);
    }

    if (!await this.organizationRepository.get(command.oldOrganizationId)) {
      await validateOrganization(this.organizationRepository, command.oldOrganizationId);
    } else if (!await this.organizationRepository.get(command.newOrganizationId)) {
      await validateOrganization(this.organizationRepository, command.newOrganizationId);
    }

    const aggregate = this.publisher.mergeObjectContext(sensorAggregate);
    aggregate.transferOwnership(command.oldOrganizationId, command.newOrganizationId);
    aggregate.commit();
  }
}
