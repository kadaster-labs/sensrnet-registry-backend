import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { LegalEntityState, LegalEntityStateImpl } from './legal-entity-state';
import { LegalEntityUpdated, getLegalEntityUpdatedEvent } from '../events/legal-entity/updated';
import { LegalEntityDeleted, getLegalEntityDeletedEvent } from '../events/legal-entity/deleted';
import { LegalEntityRegistered, getLegalEntityRegisteredEvent } from '../events/legal-entity/registered';
import { ContactDetailsBody } from '../../command/controller/model/contact-details/contact-details.body';

export class LegalEntityAggregate extends Aggregate {
  state!: LegalEntityState;

  constructor(
      private readonly aggregateId: string,
      ) {
    super();
  }

  register(name: string, website: string, contactDetails: ContactDetailsBody): void {
    this.simpleApply(new LegalEntityRegistered(this.aggregateId, name, website, contactDetails));
  }

  update(name: string, website: string, contactDetails: ContactDetailsBody): void {
    this.simpleApply(new LegalEntityUpdated(this.aggregateId, name, website, contactDetails));
  }

  delete(): void {
    this.simpleApply(new LegalEntityDeleted(this.aggregateId));
  }

  onOrganizationRegistered(eventMessage: EventMessage): void {
    const event: LegalEntityRegistered = getLegalEntityRegisteredEvent(eventMessage);

    this.state = new LegalEntityStateImpl(this.aggregateId);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onOrganizationUpdated(eventMessage: EventMessage): void {
    const event: LegalEntityUpdated = getLegalEntityUpdatedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onOrganizationDeleted(eventMessage: EventMessage): void {
    const event: LegalEntityDeleted = getLegalEntityDeletedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
