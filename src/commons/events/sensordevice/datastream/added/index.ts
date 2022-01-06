import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamAdded as V1 } from './datastream-added-v1.event';
import { DatastreamAdded as V2 } from './datastream-added-v2.event';

export { DatastreamAdded } from './datastream-added-v2.event';

export function getDatastreamAddedEvent(eventMessage: EventMessage): V2 {
    let datastreamAddedEvent = null;
    if (!eventMessage.metadata.version || eventMessage.metadata.version === V1.version) {
        const { observationArea, ...data } = eventMessage.data;
        datastreamAddedEvent = plainToClass(V2, { ...data, observedArea: observationArea });
    } else if (eventMessage.metadata.version === V2.version) {
        datastreamAddedEvent = plainToClass(V2, eventMessage.data);
    }

    return datastreamAddedEvent;
}
