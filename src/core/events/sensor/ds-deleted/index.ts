import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamDeleted as V1 } from './1.0.0/sensor-datastreamdeleted.event';

export { DatastreamDeleted } from './1.0.0/sensor-datastreamdeleted.event';

export function getDatastreamDeletedEvent(eventMessage: EventMessage): V1 {
    return plainToClass(V1, eventMessage.data);
}
