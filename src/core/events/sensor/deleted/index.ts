import { plainToClass } from 'class-transformer';
import { SensorDeleted as V1 } from './sensor-deleted-v1.event';
import { EventMessage } from '../../../../event-store/event-message';

export { SensorDeleted } from './sensor-deleted-v1.event';

export function getSensorDeletedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
