import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { DeleteDeviceCommand } from '../../../command/device/delete-device.command';

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceCommandHandler implements ICommandHandler<DeleteDeviceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
  ) {}

  async execute(command: DeleteDeviceCommand): Promise<void> {
    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.delete();
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
