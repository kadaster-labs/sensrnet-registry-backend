import { plainToClass } from 'class-transformer';
import { SensorDeleted as V1 } from './1.0.0/sensor-deleted.event';
import { EventMessage } from '../../../../event-store/event-message';

export { SensorDeleted } from './1.0.0/sensor-deleted.event';

export function getSensorDeletedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
