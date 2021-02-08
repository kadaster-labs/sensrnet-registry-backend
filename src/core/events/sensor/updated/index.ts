import { plainToClass } from 'class-transformer';
import { SensorUpdated as V1 } from './sensor-updated-v1.event';
import { EventMessage } from '../../../../event-store/event-message';

export { SensorUpdated } from './sensor-updated-v1.event';

export function getSensorUpdatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
