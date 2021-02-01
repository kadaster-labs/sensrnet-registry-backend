import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { OrganizationUpdated as V1 } from './1.0.0/organization-updated.event';

export { OrganizationUpdated } from './1.0.0/organization-updated.event';

export function getOrganizationUpdatedEvent(eventMessage: EventMessage): V1 {
    return plainToClass(V1, eventMessage.data);
}
