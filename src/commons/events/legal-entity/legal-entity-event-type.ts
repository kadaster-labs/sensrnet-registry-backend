import { AbstractEventType } from '../abstract-event-type';
import { getPublicContactDetailsAddedEvent, PublicContactDetailsAdded } from './contact-details/added';
import { ContactDetailsRemoved, getContactDetailsRemovedEvent } from './contact-details/removed';
import { ContactDetailsUpdated, getContactDetailsUpdatedEvent } from './contact-details/updated';
import { getOrganizationRegisteredEvent, OrganizationRegistered } from './organization/registered';
import { getOrganizationUpdatedEvent, OrganizationUpdated } from './organization/updated';
import { getLegalEntityRemovedEvent, LegalEntityRemoved } from './removed';

class LegalEntityEventType extends AbstractEventType {
    constructor() {
        super();

        this.add(OrganizationRegistered, getOrganizationRegisteredEvent);
        this.add(OrganizationUpdated, getOrganizationUpdatedEvent);
        this.add(LegalEntityRemoved, getLegalEntityRemovedEvent);

        this.add(PublicContactDetailsAdded, getPublicContactDetailsAddedEvent);
        this.add(ContactDetailsUpdated, getContactDetailsUpdatedEvent);
        this.add(ContactDetailsRemoved, getContactDetailsRemovedEvent);
    }
}

export const legalEntityEventType = new LegalEntityEventType();
