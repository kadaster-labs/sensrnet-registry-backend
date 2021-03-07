import { Event } from '../../../event-store/event';

export abstract class SensorDeviceEvent extends Event {

  static streamRootValue = 'sensordevice';

  readonly deviceId: string;

  protected constructor(sensorDeviceId: string, version: string) {
    super(sensorDeviceId, version);

    this.deviceId = sensorDeviceId;
  }

  streamRoot(): string {
    return SensorDeviceEvent.streamRootValue;
  }

}
