import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamUpdated as V1 } from './1.0.0/sensor-datastreamupdated.event';

export { DatastreamUpdated } from './1.0.0/sensor-datastreamupdated.event';

export function getDatastreamUpdatedEvent(eventMessage: EventMessage): V1 {
    return plainToClass(V1, eventMessage.data);
}
