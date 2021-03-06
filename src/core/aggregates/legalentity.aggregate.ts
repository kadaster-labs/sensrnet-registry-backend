import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { LegalEntityState, LegalEntityStateImpl } from './legal-entity-state';
import { OrganizationUpdated, getOrganizationUpdatedEvent } from '../events/legalentity/updated';
import { OrganizationRemoved, getOrganizationDeletedEvent } from '../events/legalentity/removed';
import { ContactDetailsBody } from '../../command/controller/model/contact-details/contact-details.body';
import { OrganizationRegistered, getOrganizationRegisteredEvent } from '../events/legalentity/registered';

export class LegalEntityAggregate extends Aggregate {
  state!: LegalEntityState;

  constructor(
      private readonly aggregateId: string,
      ) {
    super();
  }

  register(website: string, contactDetails: ContactDetailsBody): void {
    this.simpleApply(new OrganizationRegistered(this.aggregateId, website));
    // TODO process contactDetails
  }
  
  update(website: string, contactDetails: ContactDetailsBody): void {
    this.simpleApply(new OrganizationUpdated(this.aggregateId, website));
    // TODO process contactDetails
  }

  remove(): void {
    this.simpleApply(new OrganizationRemoved(this.aggregateId));
  }

  onOrganizationRegistered(eventMessage: EventMessage): void {
    const event: OrganizationRegistered = getOrganizationRegisteredEvent(eventMessage);

    this.state = new LegalEntityStateImpl(this.aggregateId);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onOrganizationUpdated(eventMessage: EventMessage): void {
    const event: OrganizationUpdated = getOrganizationUpdatedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onOrganizationRemoved(eventMessage: EventMessage): void {
    const event: OrganizationRemoved = getOrganizationDeletedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
