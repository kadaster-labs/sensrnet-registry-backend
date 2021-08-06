import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { OrganizationRegistered as V1 } from './organization-registered-v1.event';

export { OrganizationRegistered } from './organization-registered-v1.event';

export function getOrganizationRegisteredEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version
        ? plainToClass(V1, eventMessage.data)
        : null;
}
