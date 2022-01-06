import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamUpdated as V1 } from './datastream-updated-v1.event';
import { DatastreamUpdated as V2 } from './datastream-updated-v2.event';

export { DatastreamUpdated } from './datastream-updated-v2.event';

export function getDatastreamUpdatedEvent(eventMessage: EventMessage): V2 {
    let datastreamUpdatedEvent = null;
    if (!eventMessage.metadata.version || eventMessage.metadata.version === V1.version) {
        const { observationArea, ...data } = eventMessage.data;
        datastreamUpdatedEvent = plainToClass(V2, { ...data, observedArea: observationArea });
    } else if (eventMessage.metadata.version === V2.version) {
        datastreamUpdatedEvent = plainToClass(V2, eventMessage.data);
    }

    return datastreamUpdatedEvent;
}
