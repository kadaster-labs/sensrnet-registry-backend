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

    const dataStreams = []
    if (command.dto.dataStreams) {
      for (const dataStream of command.dto.dataStreams) {
        const dataStreamDto = {
          'id': command.dto.id,
          'dataStream': dataStream
        }

        const dataStreamObject = this.publisher.mergeObjectContext(
          await this.repository.addDataStream(dataStreamDto),
        );
        dataStreamObject.commit();
        dataStreams.push(dataStream);
      }

      delete command.dto.dataStreams
    }

    const {dto: registerSensorDto} = command;
    const sensorObject = this.publisher.mergeObjectContext(
      await this.repository.registerSensor(registerSensorDto),
    );

    sensorObject.commit();

    registerSensorDto.dataStreams = dataStreams;
    resolve(registerSensorDto);
  }
}
