import { AbstractEventType } from '../abstract-event-type';
import { getObservationGoalAddedEvent, ObservationGoalAdded } from './added';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from './removed';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from './updated';

class ObservationGoalEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(ObservationGoalAdded, getObservationGoalAddedEvent);
    this.add(ObservationGoalUpdated, getObservationGoalUpdatedEvent);
    this.add(ObservationGoalRemoved, getObservationGoalRemovedEvent);
  }
}

export const observationGoalEventType = new ObservationGoalEventType();
