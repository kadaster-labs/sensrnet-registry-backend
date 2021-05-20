import { validateLegalEntity } from '../../util/legal-entity.utils';
import { AlreadyExistsException } from '../../error/already-exists-exception';
import { DeviceAggregate } from '../../../../core/aggregates/device.aggregate';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { RegisterDeviceCommand } from '../../../command/device/register-device.command';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';

@CommandHandler(RegisterDeviceCommand)
export class RegisterDeviceCommandHandler implements ICommandHandler<RegisterDeviceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: RegisterDeviceCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      throw new AlreadyExistsException(command.deviceId);
    } else {
      aggregate = new DeviceAggregate(command.deviceId);
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.registerDevice(command.legalEntityId, command.name, command.description,
          command.category, command.connectivity, command.location);
      aggregate.commit();
    }
  }
}
