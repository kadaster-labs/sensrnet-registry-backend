import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { LegalEntityRegistered as V1 } from './legal-entity-registered-v1.event';

export { LegalEntityRegistered } from './legal-entity-registered-v1.event';

export function getLegalEntityRegisteredEvent(eventMessage: EventMessage): V1 {
    return (!eventMessage.metadata.version || eventMessage.metadata.version === V1.version) ? plainToClass(V1, eventMessage.data) : null;
}
