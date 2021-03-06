import { Event } from '../../../event-store/event';

export abstract class SensorDeviceEvent extends Event {

  static streamRootValue = 'sensordevice';

  readonly deviceId: string;

  protected constructor(deviceId: string, version: string) {
    super(deviceId, version);

    this.deviceId = deviceId;
  }

  streamRoot(): string {
    return SensorDeviceEvent.streamRootValue;
  }

}
