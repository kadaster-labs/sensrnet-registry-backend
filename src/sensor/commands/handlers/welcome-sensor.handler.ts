import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { WelcomeSensorCommand } from '../impl/Welcome-sensor.command';
import { SensorRepository } from '../../repository/sensor.repository';
import { Logger } from '@nestjs/common';

@CommandHandler(WelcomeSensorCommand)
export class WelcomeSensorHandler
  implements ICommandHandler<WelcomeSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: WelcomeSensorCommand, resolve: (value?) => void) {
    Logger.log('Async WelcomeSensorHandler...', 'WelcomeSensorCommand');
    const {sensorId} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.welcomeSensor({sensorId}),
    );
    sensor.commit();
    resolve();
  }
}
