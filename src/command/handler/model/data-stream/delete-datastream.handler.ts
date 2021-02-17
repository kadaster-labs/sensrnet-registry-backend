import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DataStreamRepository } from '../../../../core/repositories/data-stream.repository';
import { DeleteDataStreamCommand } from '../../../command/data-stream/delete-data-stream.command';

@CommandHandler(DeleteDataStreamCommand)
export class DeleteDataStreamCommandHandler implements ICommandHandler<DeleteDataStreamCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: DataStreamRepository,
  ) {}

  async execute(command: DeleteDataStreamCommand): Promise<void> {
    let aggregate = await this.repository.get(command.dataStreamId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.delete(command.legalEntityId, command.sensorId);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.dataStreamId);
    }
  }
}
