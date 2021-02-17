import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { UpdateDeviceCommand } from '../../../command/device/update-device.command';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { DeviceRepository } from '../../../../core/repositories/device.repository';

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceCommandHandler implements ICommandHandler<UpdateDeviceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
  ) {}

  async execute(command: UpdateDeviceCommand): Promise<void> {
    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.update(command.legalEntityId, command.description, command.connectivity, command.location);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
