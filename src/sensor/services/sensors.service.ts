import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SensorIdRequestParamsDto } from '../dtos/sensors.dto';
import { SensorDto } from '../dtos/sensors.dto';
import { CreateSensorCommand } from '../commands/impl/create-sensor.command';
import { UpdateSensorCommand } from '../commands/impl/update-sensor.command';
import { DeleteSensorCommand } from '../commands/impl/delete-sensor.command';

@Injectable()
export class SensorsService {
  constructor(private readonly commandBus: CommandBus) {}

  async createSensor(sensor: SensorDto) {
    return await this.commandBus.execute(
      new CreateSensorCommand(sensor),
    );
  }

  async updateSensor(sensor: SensorDto) {
    return await this.commandBus.execute(
      new UpdateSensorCommand(sensor),
    );
  }

  async deleteSensor(sensor: SensorIdRequestParamsDto) {
    return await this.commandBus.execute(
      new DeleteSensorCommand(sensor),
    );
  }

  async findSensor() {
    // TODO
  }
}
