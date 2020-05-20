import { Logger } from '@nestjs/common';
import { SensorRepository } from '../../repository/sensor.repository';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateSensorDetailsCommand, TransferSensorOwnershipCommand,
  ShareSensorOwnershipCommand, ActivateSensorCommand,
  DeactivateSensorCommand, AddDataStreamCommand,
  RemoveDataStreamCommand, UpdateSensorLocationCommand } from '../impl/update-sensor.command';


@CommandHandler(UpdateSensorDetailsCommand)
export class UpdateSensorDetailsHandler
  implements ICommandHandler<UpdateSensorDetailsCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateSensorDetailsCommand, resolve: (value?) => void) {
    Logger.log('Async UpdateSensorDetailsHandler...', 'UpdateSensorDetailsCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.updateSensorDetails(dto),
    );

    sensor.commit();
    resolve();
  }
}

@CommandHandler(TransferSensorOwnershipCommand)
export class TransferSensorOwnershipHandler
  implements ICommandHandler<TransferSensorOwnershipCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: TransferSensorOwnershipCommand, resolve: (value?) => void) {
    Logger.log('Async TransferSensorOwnershipHandler...', 'TransferSensorOwnershipCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.transferSensorOwnership(dto),
    );

    sensor.commit();
    resolve();
  }
}

@CommandHandler(ShareSensorOwnershipCommand)
export class ShareSensorOwnershipHandler
  implements ICommandHandler<ShareSensorOwnershipCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ShareSensorOwnershipCommand, resolve: (value?) => void) {
    Logger.log('Async ShareSensorOwnershipHandler...', 'ShareSensorOwnershipCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.shareSensorOwnership(dto),
    );

    sensor.commit();
    resolve();
  }
}

@CommandHandler(UpdateSensorLocationCommand)
export class UpdateSensorLocationHandler
  implements ICommandHandler<UpdateSensorLocationCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateSensorLocationCommand, resolve: (value?) => void) {
    Logger.log('Async UpdateSensorLocationHandler...', 'UpdateSensorLocationCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.updateSensorLocation(dto),
    );

    sensor.commit();
    resolve();
  }
}

@CommandHandler(ActivateSensorCommand)
export class ActivateSensorHandler
  implements ICommandHandler<ActivateSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ActivateSensorCommand, resolve: (value?) => void) {
    Logger.log('Async ActivateSensorHandler...', 'ActivateSensorCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.activateSensor(dto),
    );

    sensor.commit();
    resolve();
  }
}

@CommandHandler(DeactivateSensorCommand)
export class DeactivateSensorHandler
  implements ICommandHandler<DeactivateSensorCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeactivateSensorCommand, resolve: (value?) => void) {
    Logger.log('Async DeactivateSensorHandler...', 'DeactivateSensorCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.deactivateSensor(dto),
    );

    sensor.commit();
    resolve();
  }
}

@CommandHandler(AddDataStreamCommand)
export class AddDataStreamHandler
  implements ICommandHandler<AddDataStreamCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddDataStreamCommand, resolve: (value?) => void) {
    Logger.log('Async AddDataStreamHandler...', 'AddDataStreamCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.addDataStream(dto),
    );

    sensor.commit();
    resolve();
  }
}

@CommandHandler(RemoveDataStreamCommand)
export class RemoveDataStreamHandler
  implements ICommandHandler<RemoveDataStreamCommand> {
  constructor(
    private readonly repository: SensorRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveDataStreamCommand, resolve: (value?) => void) {
    Logger.log('Async RemoveSensorDataStreamHandler...', 'RemoveDataStreamCommand');

    const {dto} = command;
    const sensor = this.publisher.mergeObjectContext(
      await this.repository.removeDataStream(dto),
    );

    sensor.commit();
    resolve();
  }
}
