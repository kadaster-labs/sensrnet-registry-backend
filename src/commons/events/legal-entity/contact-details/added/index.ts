import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { PrivateContactDetailsAdded as PrivateV1 } from './private-contact-details-added-v1.event';
import { PublicContactDetailsAdded as PublicV1 } from './public-contact-details-added-v1.event';

export { PrivateContactDetailsAdded } from './private-contact-details-added-v1.event';
export { PublicContactDetailsAdded } from './public-contact-details-added-v1.event';

export function getPublicContactDetailsAddedEvent(eventMessage: EventMessage): PublicV1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === PublicV1.version
        ? plainToClass(PublicV1, eventMessage.data)
        : null;
}

export function getPrivateContactDetailsAddedEvent(eventMessage: EventMessage): PrivateV1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === PrivateV1.version
        ? plainToClass(PrivateV1, eventMessage.data)
        : null;
}
