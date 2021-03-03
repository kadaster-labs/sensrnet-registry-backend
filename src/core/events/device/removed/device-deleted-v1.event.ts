import { DeviceEvent } from '../device.event';

export class DeviceRemoved extends DeviceEvent {
  static version = '1';

  readonly legalEntityId: string;

  constructor(deviceId: string, legalEntityId: string) {
    super(deviceId, DeviceRemoved.version);
    this.legalEntityId = legalEntityId;
  }
}
