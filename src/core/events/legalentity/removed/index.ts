import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { OrganizationRemoved as V1 } from './organization-removed-v1.event';

export { OrganizationRemoved as OrganizationRemoved } from './organization-removed-v1.event';

export function getOrganizationDeletedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
