import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { LegalEntityUpdated as V1 } from './legal-entity-updated-v1.event';

export { LegalEntityUpdated } from './legal-entity-updated-v1.event';

export function getLegalEntityUpdatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
