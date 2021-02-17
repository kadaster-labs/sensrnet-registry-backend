import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DataStreamRepository } from '../../../../core/repositories/data-stream.repository';
import { UpdateDataStreamCommand } from '../../../command/data-stream/update-data-stream.command';

@CommandHandler(UpdateDataStreamCommand)
export class UpdateDataStreamCommandHandler implements ICommandHandler<UpdateDataStreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DataStreamRepository,
  ) {}

  async execute(command: UpdateDataStreamCommand): Promise<void> {
    let aggregate = await this.repository.get(command.dataStreamId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.update(command.legalEntityId, command.sensorId, command.name, command.description,
          command.unitOfMeasurement, command.isPublic, command.isOpenData, command.isReusable,
          command.containsPersonalInfoData, command.documentationUrl, command.dataLink, command.dataFrequency,
          command.dataQuality, command.theme, command.observation);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.dataStreamId);
    }
  }
}
