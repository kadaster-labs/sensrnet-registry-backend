import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../event-store/event-message';
import { ObservationGoalRemoved as V1 } from './observation-goal-removed-v1.event';

export { ObservationGoalRemoved } from './observation-goal-removed-v1.event';

export function getObservationGoalRemovedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version
        ? plainToClass(V1, eventMessage.data)
        : null;
}
