import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { LegalEntityRemoved as V1 } from './legal-entity-removed-v1.event';

export { LegalEntityRemoved } from './legal-entity-removed-v1.event';

export function getLegalEntityRemovedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
