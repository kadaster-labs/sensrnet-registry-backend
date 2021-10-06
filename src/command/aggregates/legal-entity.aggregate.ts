import { Aggregate } from '../../commons/event-store/aggregate';
import { EventMessage } from '../../commons/event-store/event-message';
import {
    getPublicContactDetailsAddedEvent,
    PublicContactDetailsAdded,
} from '../../commons/events/legal-entity/contact-details/added';
import {
    ContactDetailsRemoved,
    getContactDetailsRemovedEvent,
} from '../../commons/events/legal-entity/contact-details/removed';
import {
    ContactDetailsUpdated,
    getContactDetailsUpdatedEvent,
} from '../../commons/events/legal-entity/contact-details/updated';
import {
    getOrganizationRegisteredEvent,
    OrganizationRegistered,
} from '../../commons/events/legal-entity/organization/registered';
import {
    getOrganizationUpdatedEvent,
    OrganizationUpdated,
} from '../../commons/events/legal-entity/organization/updated';
import { getLegalEntityRemovedEvent, LegalEntityRemoved } from '../../commons/events/legal-entity/removed';
import { LegalEntityState, LegalEntityStateImpl } from './legal-entity-state';

export class LegalEntityAggregate extends Aggregate {
    state!: LegalEntityState;

    constructor(public readonly aggregateId: string) {
        super();
    }

    register(userId: string, name: string, website: string): void {
        this.simpleApply(new OrganizationRegistered(this.aggregateId, userId, name, website));
    }

    onOrganizationRegistered(eventMessage: EventMessage): void {
        const event: OrganizationRegistered = getOrganizationRegisteredEvent(eventMessage);
        this.logUnusedInAggregate(event);

        this.state = new LegalEntityStateImpl(this.aggregateId);
    }

    update(name: string, website: string): void {
        this.simpleApply(new OrganizationUpdated(this.aggregateId, name, website));
    }

    onOrganizationUpdated(eventMessage: EventMessage): void {
        const event: OrganizationUpdated = getOrganizationUpdatedEvent(eventMessage);
        this.logUnusedInAggregate(event);
    }

    remove(): void {
        this.simpleApply(new LegalEntityRemoved(this.aggregateId));
    }

    onLegalEntityRemoved(eventMessage: EventMessage): void {
        const event: LegalEntityRemoved = getLegalEntityRemovedEvent(eventMessage);
        this.logUnusedInAggregate(event);
    }

    addPublicContactDetails(contactDetailsId: string, name: string, email: string, phone: string): void {
        this.simpleApply(new PublicContactDetailsAdded(this.aggregateId, contactDetailsId, name, email, phone));
    }

    onPublicContactDetailsAdded(eventMessage: EventMessage): void {
        const event: PublicContactDetailsAdded = getPublicContactDetailsAddedEvent(eventMessage);
        this.logUnusedInAggregate(event);
    }

    updateContactDetails(contactDetailsId: string, name: string, email: string, phone: string): void {
        this.simpleApply(new ContactDetailsUpdated(this.aggregateId, contactDetailsId, name, email, phone));
    }

    onContactDetailsUpdated(eventMessage: EventMessage): void {
        const event: ContactDetailsUpdated = getContactDetailsUpdatedEvent(eventMessage);
        this.logUnusedInAggregate(event);
    }

    removeContactDetails(contactDetailsId: string): void {
        this.simpleApply(new ContactDetailsRemoved(this.aggregateId, contactDetailsId));
    }

    onContactDetailsRemoved(eventMessage: EventMessage): void {
        const event: ContactDetailsRemoved = getContactDetailsRemovedEvent(eventMessage);
        this.logUnusedInAggregate(event);
    }
}
