import { DeviceEvent } from '../device.event';

export class DeviceDeleted extends DeviceEvent {
  static version = '1';

  constructor(deviceId: string) {
    super(deviceId, DeviceDeleted.version);
  }
}
