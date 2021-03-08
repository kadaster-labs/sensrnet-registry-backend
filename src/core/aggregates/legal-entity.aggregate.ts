import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { getPublicContactDetailsAddedEvent, PublicContactDetailsAdded } from '../events/legal-entity/contact-details/added';
import { ContactDetailsRemoved, getContactDetailsRemovedEvent } from '../events/legal-entity/contact-details/removed';
import { ContactDetailsUpdated, getContactDetailsUpdatedEvent } from '../events/legal-entity/contact-details/updated';
import { getOrganizationRegisteredEvent, OrganizationRegistered } from '../events/legal-entity/organization/registered';
import { getOrganizationUpdatedEvent, OrganizationUpdated } from '../events/legal-entity/organization/updated';
import { getLegalEntityRemovedEvent, LegalEntityRemoved } from '../events/legal-entity/removed';
import { LegalEntityState, LegalEntityStateImpl } from './legal-entity-state';

export class LegalEntityAggregate extends Aggregate {
  state!: LegalEntityState;

  constructor(
    private readonly aggregateId: string,
  ) {
    super();
  }

  register(name: string, website: string): void {
    this.simpleApply(new OrganizationRegistered(this.aggregateId, name, website));
  }

  onOrganizationRegistered(eventMessage: EventMessage): void {
    const event: OrganizationRegistered = getOrganizationRegisteredEvent(eventMessage);
    this.state = new LegalEntityStateImpl(this.aggregateId);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  update(name: string, website: string): void {
    this.simpleApply(new OrganizationUpdated(this.aggregateId, name, website));
  }

  onOrganizationUpdated(eventMessage: EventMessage): void {
    const event: OrganizationUpdated = getOrganizationUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  remove(): void {
    this.simpleApply(new LegalEntityRemoved(this.aggregateId));
  }

  onLegalEntityRemoved(eventMessage: EventMessage): void {
    const event: LegalEntityRemoved = getLegalEntityRemovedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  addPublicContactDetails(contactDetailsId: string, name: string, email: string, phone: string): void {
    this.simpleApply(new PublicContactDetailsAdded(this.aggregateId, contactDetailsId, name, email, phone));
  }

  onPublicContactDetailsAdded(eventMessage: EventMessage): void {
    const event: PublicContactDetailsAdded = getPublicContactDetailsAddedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  updateContactDetails(contactDetailsId: string, name: string, email: string, phone: string): void {
    this.simpleApply(new ContactDetailsUpdated(this.aggregateId, contactDetailsId, name, email, phone));
  }

  onContactDetailsUpdated(eventMessage: EventMessage): void {
    const event: ContactDetailsUpdated = getContactDetailsUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  removeContactDetails(contactDetailsId: string): void {
    this.simpleApply(new ContactDetailsRemoved(this.aggregateId, contactDetailsId));
  }

  onContactDetailsRemoved(eventMessage: EventMessage): void {
    const event: ContactDetailsRemoved = getContactDetailsRemovedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
