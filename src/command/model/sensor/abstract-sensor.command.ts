import { ICommand } from '@nestjs/cqrs';
import Sensor from '../../interfaces/sensor.interface';

export abstract class AbstractSensorCommand implements ICommand {
  public readonly sensorId: string;
  public readonly name: string;
  public readonly description: string;
  public readonly type: string;
  public readonly manufacturer: string;
  public readonly supplier: string;
  public readonly documentation: string;

  constructor(
    public readonly deviceId: string,
    public readonly legalEntityId: string,
    sensor: Sensor,
  ) {
    this.sensorId = sensor.sensorId;
    this.name = sensor.name;
    this.description = sensor.description;
    this.type = sensor.type;
    this.manufacturer = sensor.manufacturer;
    this.supplier = sensor.supplier;
    this.documentation = sensor.documentation;
    }
}
