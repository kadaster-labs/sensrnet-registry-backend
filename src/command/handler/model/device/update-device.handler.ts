import { validateLegalEntity } from '../../util/legal-entity.utils';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { UpdateDeviceCommand } from '../../../command/device/update-device.command';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceCommandHandler implements ICommandHandler<UpdateDeviceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: UpdateDeviceCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.updateDevice(command.legalEntityId, command.name, command.description,
          command.category, command.connectivity, command.location);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
