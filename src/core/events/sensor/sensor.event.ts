import { Event } from '../../../event-store/event';

export abstract class SensorEvent extends Event {

  readonly sensorId: string;

  protected constructor(sensorId: string) {
    super(sensorId);
    this.sensorId = sensorId;
  }

  streamRoot(): string {
    return 'sensor';
  }
}
