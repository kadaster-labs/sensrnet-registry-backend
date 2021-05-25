import { validateLegalEntity } from '../../util/legal-entity.utils';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { RemoveDeviceCommand } from '../../../command/device/remove-device.command';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';

@CommandHandler(RemoveDeviceCommand)
export class RemoveDeviceCommandHandler implements ICommandHandler<RemoveDeviceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: RemoveDeviceCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.removeDevice(command.legalEntityId);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
