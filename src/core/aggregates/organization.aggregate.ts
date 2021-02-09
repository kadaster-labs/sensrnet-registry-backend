import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { OrganizationState, OrganizationStateImpl } from './organization-state';
import { OrganizationUpdated, getOrganizationUpdatedEvent } from '../events/organization/updated';
import { OrganizationDeleted, getOrganizationDeletedEvent } from '../events/organization/deleted';
import { OrganizationRegistered, getOrganizationRegisteredEvent } from '../events/organization/registered';

export class OrganizationAggregate extends Aggregate {
  state!: OrganizationState;

  constructor(
      private readonly aggregateId: string,
      ) {
    super();
  }

  register(website: string, contactName: string, contactEmail: string, contactPhone: string): void {
    this.simpleApply(new OrganizationRegistered(this.aggregateId, website, contactName, contactEmail, contactPhone));
  }

  update(website: string, contactName: string, contactEmail: string, contactPhone: string): void {
    this.simpleApply(new OrganizationUpdated(this.aggregateId, website, contactName, contactEmail, contactPhone));
  }

  delete(): void {
    this.simpleApply(new OrganizationDeleted(this.aggregateId));
  }

  onOrganizationRegistered(eventMessage: EventMessage): void {
    const event: OrganizationRegistered = getOrganizationRegisteredEvent(eventMessage);

    this.state = new OrganizationStateImpl(this.aggregateId);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onOrganizationUpdated(eventMessage: EventMessage): void {
    const event: OrganizationUpdated = getOrganizationUpdatedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onOrganizationDeleted(eventMessage: EventMessage): void {
    const event: OrganizationDeleted = getOrganizationDeletedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
