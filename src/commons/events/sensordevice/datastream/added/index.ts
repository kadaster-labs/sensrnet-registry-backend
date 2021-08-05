import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamAdded as V1 } from './datastream-added-v1.event';

export { DatastreamAdded } from './datastream-added-v1.event';

export function getDatastreamAddedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
