import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { RegisterSensorDto } from '../dtos/register-sensor.dto';
import { SensorIdDto, LocationDto, DataStreamDto } from '../dtos/sensor.dto';
import { RemoveSensorCommand } from '../commands/impl/remove-sensor.command';
import { RegisterSensorCommand } from '../commands/impl/register-sensor.command';
import { UpdateSensorDetailsDto, TransferSensorOwnershipDto,
  ShareSensorOwnershipDto } from '../dtos/update-sensor.dto';
import { UpdateSensorDetailsCommand, TransferSensorOwnershipCommand,
  ShareSensorOwnershipCommand, ActivateSensorCommand,
  DeactivateSensorCommand, AddDataStreamCommand,
  RemoveDataStreamCommand, UpdateSensorLocationCommand } from '../commands/impl/update-sensor.command';


@Injectable()
export class SensorService {
  constructor(private readonly commandBus: CommandBus) {}

  async registerSensor(sensor: RegisterSensorDto) {
    return await this.commandBus.execute(
      new RegisterSensorCommand(sensor),
    );
  }

  async updateSensorDetails(sensor: UpdateSensorDetailsDto) {
    return await this.commandBus.execute(
      new UpdateSensorDetailsCommand(sensor),
    );
  }

  async transferSensorOwnership(sensor: TransferSensorOwnershipDto) {
    return await this.commandBus.execute(
      new TransferSensorOwnershipCommand(sensor),
    );
  }

  async shareSensorOwnership(sensor: ShareSensorOwnershipDto) {
    return await this.commandBus.execute(
      new ShareSensorOwnershipCommand(sensor),
    );
  }

  async updateSensorLocation(sensor: LocationDto) {
    return await this.commandBus.execute(
      new UpdateSensorLocationCommand(sensor),
    );
  }

  async activateSensor(sensor: SensorIdDto) {
    return await this.commandBus.execute(
      new ActivateSensorCommand(sensor),
    );
  }

  async deactivateSensor(sensor: SensorIdDto) {
    return await this.commandBus.execute(
      new DeactivateSensorCommand(sensor),
    );
  }

  async addDataStream(dataStream: DataStreamDto) {
    return await this.commandBus.execute(
      new AddDataStreamCommand(dataStream),
    );
  }

  async removeDataStream(dataStream: DataStreamDto) {
    return await this.commandBus.execute(
      new RemoveDataStreamCommand(dataStream),
    );
  }

  async removeSensor(sensor: SensorIdDto) {
    return await this.commandBus.execute(
      new RemoveSensorCommand(sensor),
    );
  }
}
