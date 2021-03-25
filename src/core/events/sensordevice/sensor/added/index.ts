import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../../event-store/event-message';
import { SensorAdded as V1 } from './sensor-added-v1.event';

export { SensorAdded } from './sensor-added-v1.event';

export function getSensorAddedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
