import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { OrganizationUpdated as V1 } from './organization-updated-v1.event';

export { OrganizationUpdated as OrganizationUpdated } from './organization-updated-v1.event';

export function getOrganizationUpdatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
