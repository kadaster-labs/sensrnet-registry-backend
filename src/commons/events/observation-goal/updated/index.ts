import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../event-store/event-message';
import { ObservationGoalUpdated as V1 } from './observation-goal-updated-v1.event';

export { ObservationGoalUpdated } from './observation-goal-updated-v1.event';

export function getObservationGoalUpdatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version
        ? plainToClass(V1, eventMessage.data)
        : null;
}
