import Sensor from '../../interfaces/sensor.interface';
import { AbstractSensorCommand } from './abstract-sensor.command';

export class UpdateSensorCommand extends AbstractSensorCommand {
  constructor(
    public readonly deviceId: string,
    public readonly legalEntityId: string,
    sensor: Sensor,
  ) {
    super(deviceId, legalEntityId, sensor);
  }
}
