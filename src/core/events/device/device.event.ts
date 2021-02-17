import { Event } from '../../../event-store/event';

export abstract class DeviceEvent extends Event {

  static streamRootValue = 'device';

  readonly deviceId: string;

  protected constructor(deviceId: string, version: string) {
    super(deviceId, version);

    this.deviceId = deviceId;
  }

  streamRoot(): string {
    return DeviceEvent.streamRootValue;
  }

}
