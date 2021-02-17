import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { LegalEntityDeleted as V1 } from './legal-entity-deleted-v1.event';

export { LegalEntityDeleted } from './legal-entity-deleted-v1.event';

export function getLegalEntityDeletedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
