import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { RemoveSensorCommand } from '../../../command/sensor/remove-sensor.command';
import { validateLegalEntity } from '../../util/legal-entity.utils';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';

@CommandHandler(RemoveSensorCommand)
export class RemoveSensorCommandHandler
  implements ICommandHandler<RemoveSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: RemoveSensorCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.removeSensor(command.sensorId, command.legalEntityId);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
