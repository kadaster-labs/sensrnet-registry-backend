import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { OrganizationRegistered as V1 } from './1/organization-registered.event';

export { OrganizationRegistered } from './1/organization-registered.event';

export function getOrganizationRegisteredEvent(eventMessage: EventMessage): V1 {
    return (!eventMessage.metadata.version || eventMessage.metadata.version === V1.version) ? plainToClass(V1, eventMessage.data) : null;
}
