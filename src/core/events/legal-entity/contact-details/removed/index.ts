import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../../event-store/event-message';
import { ContactDetailsRemoved as V1 } from './contact-details-removed-v1.event';

export { ContactDetailsRemoved as ContactDetailsRemoved } from './contact-details-removed-v1.event';

export function getContactDetailsRemovedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
