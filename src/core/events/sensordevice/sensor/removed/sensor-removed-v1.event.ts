import { SensorDeviceEvent } from '../../sensordevice.event';

export class SensorRemoved extends SensorDeviceEvent {
  static version = '1';

  readonly sensorId: string;
  readonly legalEntityId: string;

  constructor(deviceId: string, sensorId: string, legalEntityId: string) {
    super(deviceId, SensorRemoved.version);

    this.sensorId = sensorId;
    this.legalEntityId = legalEntityId;
  }
}
