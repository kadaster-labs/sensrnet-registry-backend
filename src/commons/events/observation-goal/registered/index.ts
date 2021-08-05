import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../event-store/event-message';
import { ObservationGoalRegistered as V1 } from './observation-goal-registered-v1.event';

export { ObservationGoalRegistered } from './observation-goal-registered-v1.event';

export function getObservationGoalRegisteredEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
