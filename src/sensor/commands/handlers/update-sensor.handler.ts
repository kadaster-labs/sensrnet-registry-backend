import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateSensorCommand } from '../impl/update-sensor.command';
import { SensorRepository } from '../../repository/sensor.repository';
import { Logger } from '@nestjs/common';

@CommandHandler(UpdateSensorCommand)
export class UpdateSensorHandler
  implements ICommandHandler<UpdateSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateSensorCommand, resolve: (value?) => void) {
    Logger.log('Async UpdateSensorHandler...', 'UpdateSensorCommand');

    const {sensorDto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.updateSensor(sensorDto),
    );
    sensor.commit();
    resolve();
  }
}
