import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { ObservationGoalLinked as V1 } from './observation-goal-linked-v1.event';

export { ObservationGoalLinked } from './observation-goal-linked-v1.event';

export function getObservationGoalLinkedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version
        ? plainToClass(V1, eventMessage.data)
        : null;
}
