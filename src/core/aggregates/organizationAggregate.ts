import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { OrganizationState, OrganizationStateImpl } from './organization-state';
import { OrganizationDeleted, OrganizationRegistered, OrganizationUpdated } from '../events/organization';

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
    const event: OrganizationRegistered = eventMessage.data as OrganizationRegistered;
    this.state = new OrganizationStateImpl(this.aggregateId);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onOrganizationUpdated(eventMessage: EventMessage): void {
    const event: OrganizationUpdated = eventMessage.data as OrganizationUpdated;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onOrganizationDeleted(eventMessage: EventMessage): void {
    const event: OrganizationDeleted = eventMessage.data as OrganizationDeleted;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
