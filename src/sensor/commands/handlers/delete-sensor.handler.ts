import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteSensorCommand } from '../impl/delete-sensor.command';
import { SensorRepository } from '../../repository/sensor.repository';
import { Logger } from '@nestjs/common';

@CommandHandler(DeleteSensorCommand)
export class DeleteSensorHandler
  implements ICommandHandler<DeleteSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteSensorCommand, resolve: (value?) => void) {
    Logger.log('Async DeleteSensorHandler...', 'DeleteSensorCommand');
    const {sensorDto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.deleteSensor(sensorDto),
    );
    sensor.commit();
    resolve();
  }
}
