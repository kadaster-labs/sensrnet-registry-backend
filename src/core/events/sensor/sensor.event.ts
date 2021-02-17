import { Event } from '../../../event-store/event';

export abstract class SensorEvent extends Event {

  static streamRootValue = 'sensor';

  readonly sensorId: string;

  protected constructor(sensorId: string, version: string) {
    super(sensorId, version);

    this.sensorId = sensorId;
  }

  streamRoot(): string {
    return SensorEvent.streamRootValue;
  }

}
