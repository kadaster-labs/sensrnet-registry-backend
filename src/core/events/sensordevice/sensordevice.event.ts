import { Event } from '../../../event-store/event';
import { sensorDeviceEventType } from './sensordevice-event-type';

export abstract class SensorDeviceEvent extends Event {

  static streamRootValue = sensorDeviceEventType.streamRootValue;

  readonly deviceId: string;

  protected constructor(sensorDeviceId: string, version: string) {
    super(sensorDeviceId, version);

    this.deviceId = sensorDeviceId;
  }

  streamRoot(): string {
    return SensorDeviceEvent.streamRootValue;
  }

}
