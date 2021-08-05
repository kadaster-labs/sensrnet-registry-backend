import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamUpdated as V1 } from './datastreamupdated-v1.event';

export { DatastreamUpdated } from './datastreamupdated-v1.event';

export function getDatastreamUpdatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
