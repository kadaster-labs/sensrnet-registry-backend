import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DataStreamRepository } from '../../../../core/repositories/data-stream.repository';
import { RegisterDataStreamCommand } from '../../../command/data-stream/register-data-stream.command';
import { AlreadyExistsException } from '../../error/already-exists-exception';
import { DataStreamAggregate } from '../../../../core/aggregates/data-stream.aggregate';
import { Logger } from '@nestjs/common';

@CommandHandler(RegisterDataStreamCommand)
export class CreateDataStreamCommandHandler implements ICommandHandler<RegisterDataStreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DataStreamRepository,
  ) {}

  async execute(command: RegisterDataStreamCommand): Promise<void> {
    let aggregate = await this.repository.get(command.dataStreamId);
    if (aggregate) {
      throw new AlreadyExistsException(command.dataStreamId);
    } else {
      aggregate = new DataStreamAggregate(command.dataStreamId);
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.register(command.legalEntityId, command.sensorId, command.name, command.description,
          command.unitOfMeasurement, command.isPublic, command.isOpenData, command.isReusable,
          command.containsPersonalInfoData, command.documentationUrl, command.dataLink, command.dataFrequency,
          command.dataQuality, command.theme, command.observation);
      aggregate.commit();
    }
  }
}
