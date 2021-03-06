import { Event } from '../../../event-store/event';

export abstract class ObservationGoalEvent extends Event {

  static streamRootValue = 'observationgoal';

  readonly deviceId: string;

  protected constructor(deviceId: string, version: string) {
    super(deviceId, version);

    this.deviceId = deviceId;
  }

  streamRoot(): string {
    return ObservationGoalEvent.streamRootValue;
  }

}
