import { Logger } from '@nestjs/common';
import { SensorRepository } from '../../repository/sensor.repository';
import { RegisterSensorCommand } from '../impl/register-sensor.command';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';


@CommandHandler(RegisterSensorCommand)
export class RegisterSensorHandler
  implements ICommandHandler<RegisterSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RegisterSensorCommand, resolve: (value?) => void) {
    Logger.log('Async RegisterSensorHandler...', 'RegisterSensorCommand');

    const {dto: registerSensorDto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.registerSensor(registerSensorDto),
    );

    sensor.commit();
    resolve();
  }
}
