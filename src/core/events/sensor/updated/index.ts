import { plainToClass } from 'class-transformer';
import { SensorUpdated as V1 } from './1.0.0/sensor-updated.event';
import { EventMessage } from '../../../../event-store/event-message';

export { SensorUpdated } from './1.0.0/sensor-updated.event';

export function getSensorUpdatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
