import { Event } from '../../../event-store/event';

export abstract class ObservationGoalEvent extends Event {

  static streamRootValue = 'observationgoal';

  protected constructor(observationGoalId: string, version: string) {
    super(observationGoalId, version);
  }

  streamRoot(): string {
    return ObservationGoalEvent.streamRootValue;
  }
}
