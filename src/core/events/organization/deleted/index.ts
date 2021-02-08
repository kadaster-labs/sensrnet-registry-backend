import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { OrganizationDeleted as V1 } from './1/organization-deleted.event';

export { OrganizationDeleted } from './1/organization-deleted.event';

export function getOrganizationDeletedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
