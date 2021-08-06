import { validateLegalEntity } from '../../util/legal-entity.utils';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../repositories/device.repository';
import { AddDatastreamCommand } from '../../../model/data-stream/add-data-stream.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';

@CommandHandler(AddDatastreamCommand)
export class AddDatastreamCommandHandler implements ICommandHandler<AddDatastreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: AddDatastreamCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.addDatastream(command.sensorId, command.legalEntityId, command.datastreamId,
          command.name, command.description, command.unitOfMeasurement, command.observationArea,
          command.theme, command.dataQuality, command.isActive, command.isPublic, command.isOpenData,
          command.containsPersonalInfoData, command.isReusable, command.documentation, command.dataLink);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
