import { Event } from '../../../event-store/event';

export abstract class ObservationGoalEvent extends Event {

  static streamRootValue = 'observationgoal';

  protected constructor(legalEntityId: string, version: string) {
    super(legalEntityId, version);
  }

  streamRoot(): string {
    return ObservationGoalEvent.streamRootValue;
  }
}
