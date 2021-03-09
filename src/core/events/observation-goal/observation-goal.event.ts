import { Event } from '../../../event-store/event';
import { observationGoalEventType } from './observation-goal-event-type';

export abstract class ObservationGoalEvent extends Event {

  static streamRootValue = observationGoalEventType.streamRootValue;

  protected constructor(observationGoalId: string, version: string) {
    super(observationGoalId, version);
  }

  streamRoot(): string {
    return ObservationGoalEvent.streamRootValue;
  }
}
