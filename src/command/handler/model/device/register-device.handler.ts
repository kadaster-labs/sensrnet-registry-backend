import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceAggregate } from '../../../../core/aggregates/device.aggregate';
import { RegisterDeviceCommand } from '../../../command/device/register-device.command';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { AlreadyExistsException } from '../../error/already-exists-exception';

@CommandHandler(RegisterDeviceCommand)
export class RegisterDeviceCommandHandler implements ICommandHandler<RegisterDeviceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
  ) {}

  async execute(command: RegisterDeviceCommand): Promise<void> {
    let aggregate = await this.repository.get(command.deviceId);

    if (aggregate) {
      throw new AlreadyExistsException(command.deviceId);
    } else {
      aggregate = new DeviceAggregate(command.deviceId);
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.register(command.legalEntityId, command.description, command.connectivity, command.location);
      aggregate.commit();
    }
  }
}
