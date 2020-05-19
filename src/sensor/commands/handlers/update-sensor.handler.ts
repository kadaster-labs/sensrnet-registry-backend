import { Logger } from '@nestjs/common';
import { SensorRepository } from '../../repository/sensor.repository';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateSensorCommand, UpdateSensorOwnerCommand } from '../impl/update-sensor.command';


@CommandHandler(UpdateSensorCommand)
export class UpdateSensorHandler
  implements ICommandHandler<UpdateSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateSensorCommand, resolve: (value?) => void) {
    Logger.log('Async UpdateSensorHandler...', 'UpdateSensorCommand');
    
    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.updateSensor(dto),
    );

    sensor.commit();
    resolve();
  }
}

@CommandHandler(UpdateSensorOwnerCommand)
export class UpdateSensorOwnerHandler
  implements ICommandHandler<UpdateSensorOwnerCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateSensorOwnerCommand, resolve: (value?) => void) {
    Logger.log('Async UpdateSensorOwnerHandler...', 'UpdateSensorOwnerCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.updateSensorOwner(dto),
    );

    sensor.commit();
    resolve();
  }
}
