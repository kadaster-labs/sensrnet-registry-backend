import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../repositories/device.repository';
import { UpdateDatastreamCommand } from '../../../model/data-stream/update-data-stream.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { validateLegalEntity } from '../../util/legal-entity.utils';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';

@CommandHandler(UpdateDatastreamCommand)
export class UpdateDatastreamCommandHandler implements ICommandHandler<UpdateDatastreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: UpdateDatastreamCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.updateDatastream(command.sensorId, command.legalEntityId, command.datastreamId,
          command.name, command.description, command.unitOfMeasurement, command.observationArea,
          command.theme, command.dataQuality, command.isActive, command.isPublic, command.isOpenData,
          command.containsPersonalInfoData, command.isReusable, command.documentation, command.dataLink);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
