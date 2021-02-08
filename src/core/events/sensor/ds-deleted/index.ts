import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamDeleted as V1 } from './sensor-datastreamdeleted-v1.event';

export { DatastreamDeleted } from './sensor-datastreamdeleted-v1.event';

export function getDatastreamDeletedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
