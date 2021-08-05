import { validateLegalEntity } from '../../util/legal-entity.utils';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { AddSensorCommand } from '../../../model/sensor/add-sensor.command';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../repositories/device.repository';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';

@CommandHandler(AddSensorCommand)
export class AddSensorCommandHandler implements ICommandHandler<AddSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: AddSensorCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.addSensor(command.sensorId, command.legalEntityId, command.name, command.description,
          command.type, command.manufacturer, command.supplier, command.documentation);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
