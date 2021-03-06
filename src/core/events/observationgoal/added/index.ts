import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { ObservationGoalAdded as V1 } from './observation-goal-added-v1.event';

export { ObservationGoalAdded } from './observation-goal-added-v1.event';

export function getObservationGoalAddedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
