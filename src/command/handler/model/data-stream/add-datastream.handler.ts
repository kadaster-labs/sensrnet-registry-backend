import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { AddDataStreamCommand } from '../../../command/data-stream/add-data-stream.command';
import { validateLegalEntity } from '../../util/legal-entity.utils';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';

@CommandHandler(AddDataStreamCommand)
export class AddDataStreamCommandHandler implements ICommandHandler<AddDataStreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DeviceRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: AddDataStreamCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    } else {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.repository.get(command.deviceId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.addDataStream(command.sensorId, command.legalEntityId, command.dataStreamId,
          command.name, command.description, command.unitOfMeasurement, command.observationArea,
          command.theme, command.dataQuality, command.isActive, command.isPublic, command.isOpenData,
          command.containsPersonalInfoData, command.isReusable, command.documentation, command.dataLink);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
