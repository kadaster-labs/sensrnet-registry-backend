import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamAdded as V1 } from './1.0.0/sensor-datastreamadded.event';

export { DatastreamAdded } from './1.0.0/sensor-datastreamadded.event';

export function getDatastreamAddedEvent(eventMessage: EventMessage): V1 {
    return plainToClass(V1, eventMessage.data);
}
