import { Event } from '../../../event-store/event';
import { observationGoalStreamRootValue } from './observation-goal.stream';

export abstract class ObservationGoalEvent extends Event {

  static streamRootValue = observationGoalStreamRootValue;

  protected constructor(observationGoalId: string, version: string) {
    super(observationGoalId, version);
  }

  streamRoot(): string {
    return ObservationGoalEvent.streamRootValue;
  }
}
