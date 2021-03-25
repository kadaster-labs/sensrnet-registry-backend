import { AbstractEventType } from '../abstract-event-type';
import { getObservationGoalRegisteredEvent, ObservationGoalRegistered } from './registered';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from './removed';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from './updated';

class ObservationGoalEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(ObservationGoalRegistered, getObservationGoalRegisteredEvent);
    this.add(ObservationGoalUpdated, getObservationGoalUpdatedEvent);
    this.add(ObservationGoalRemoved, getObservationGoalRemovedEvent);
  }
}

export const observationGoalEventType = new ObservationGoalEventType();
