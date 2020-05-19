import { Logger } from '@nestjs/common';
import { RemoveSensorCommand } from '../impl/remove-sensor.command';
import { SensorRepository } from '../../repository/sensor.repository';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';


@CommandHandler(RemoveSensorCommand)
export class RemoveSensorHandler
  implements ICommandHandler<RemoveSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveSensorCommand, resolve: (value?) => void) {
    Logger.log('Async RemoveSensorHandler...', 'RemoveSensorCommand');
    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.removeSensor(dto),
    );

    sensor.commit();
    resolve();
  }
}
