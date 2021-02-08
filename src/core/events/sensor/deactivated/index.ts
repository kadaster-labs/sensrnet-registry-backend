import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorDeactivated as V1 } from './sensor-deactivated-v1.event';

export { SensorDeactivated } from './sensor-deactivated-v1.event';

export function getSensorDeactivatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
