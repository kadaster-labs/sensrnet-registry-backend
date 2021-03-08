import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../../event-store/event-message';
import { SensorRemoved as V1 } from './sensor-removed-v1.event';

export { SensorRemoved } from './sensor-removed-v1.event';

export function getSensorRemovedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
