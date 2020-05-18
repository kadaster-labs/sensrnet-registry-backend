import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateSensorCommand } from '../impl/create-sensor.command';
import { SensorRepository } from '../../repository/sensor.repository';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateSensorCommand)
export class CreateSensorHandler
  implements ICommandHandler<CreateSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateSensorCommand, resolve: (value?) => void) {
    Logger.log('Async CreateSensorHandler...', 'CreateSensorCommand');

    const {sensorDto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.createSensor(sensorDto),
    );
    sensor.commit();
    resolve();
  }
}
