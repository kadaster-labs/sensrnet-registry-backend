import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorDeactivated as V1 } from './1.0.0/sensor-deactivated.event';

export { SensorDeactivated } from './1.0.0/sensor-deactivated.event';

export function getSensorDeactivatedEvent(eventMessage: EventMessage): V1 {
    return plainToClass(V1, eventMessage.data);
}
