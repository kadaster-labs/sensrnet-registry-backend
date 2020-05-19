import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { SensorIdDto } from '../dtos/sensor.dto';
import { UpdateSensorDto } from '../dtos/update-sensor.dto';
import { RegisterSensorDto } from '../dtos/register-sensor.dto';
import { RemoveSensorCommand } from '../commands/impl/remove-sensor.command';
import { RegisterSensorCommand } from '../commands/impl/register-sensor.command';
import { UpdateSensorCommand, UpdateSensorOwnerCommand } from '../commands/impl/update-sensor.command';


@Injectable()
export class SensorService {
  constructor(private readonly commandBus: CommandBus) {}

  async registerSensor(sensor: RegisterSensorDto) {
    return await this.commandBus.execute(
      new RegisterSensorCommand(sensor),
    );
  }

  async updateSensor(sensor: UpdateSensorDto) {
    const commandPromises = [];

    if (sensor.addOwnerIds || sensor.removeOwnerIds) {
      const ownerDto = {
        id: sensor.id,
        comment: sensor.comment,
        addOwnerIds: sensor.addOwnerIds,
        removeOwnerIds: sensor.removeOwnerIds
      };

      commandPromises.push(this.commandBus.execute(
        new UpdateSensorOwnerCommand(ownerDto),
      ));

      delete sensor.addOwnerIds
      delete sensor.removeOwnerIds
    }

    if (Object.keys(sensor).length > 1) {
      const updateSensorPromise = this.commandBus.execute(
        new UpdateSensorCommand(sensor),
      )
      commandPromises.push(updateSensorPromise);
    }

    return await Promise.all(commandPromises);
  }

  async removeSensor(sensor: SensorIdDto) {
    return await this.commandBus.execute(
      new RemoveSensorCommand(sensor),
    );
  }
}
