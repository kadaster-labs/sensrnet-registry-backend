import { DeviceEvent } from '../../device/device.event';

export class SensorRemoved extends DeviceEvent {
  static version = '1';

  readonly sensorId: string;
  readonly legalEntityId: string;

  constructor(deviceId: string, sensorId: string, legalEntityId: string) {
    super(deviceId, SensorRemoved.version);

    this.sensorId = sensorId;
    this.legalEntityId = legalEntityId;
  }
}
