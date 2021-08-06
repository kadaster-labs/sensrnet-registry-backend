import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamRemoved as V1 } from './datastream-removed-v1.event';

export { DatastreamRemoved } from './datastream-removed-v1.event';

export function getDatastreamRemovedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version
        ? plainToClass(V1, eventMessage.data)
        : null;
}
