import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { OrganizationDeleted as V1 } from './1.0.0/organization-deleted.event';

export { OrganizationDeleted } from './1.0.0/organization-deleted.event';

export function getOrganizationDeletedEvent(eventMessage: EventMessage): V1 {
    return plainToClass(V1, eventMessage.data);
}
