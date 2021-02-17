import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorRegistered as V1 } from './sensor-registered-v1.event';

export { SensorRegistered } from './sensor-registered-v1.event';

export function getSensorRegisteredEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
