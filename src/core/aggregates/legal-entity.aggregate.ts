import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { LegalEntityState, LegalEntityStateImpl } from './legal-entity-state';
import { LegalEntityUpdated, getLegalEntityUpdatedEvent } from '../events/legal-entity/updated';
import { LegalEntityRemoved, getLegalEntityDeletedEvent } from '../events/legal-entity/removed';
import { ContactDetailsBody } from '../../command/controller/model/contact-details/contact-details.body';
import { LegalEntityRegistered, getLegalEntityRegisteredEvent } from '../events/legal-entity/registered';

export class LegalEntityAggregate extends Aggregate {
  state!: LegalEntityState;

  constructor(
      private readonly aggregateId: string,
      ) {
    super();
  }

  register(website: string, contactDetails: ContactDetailsBody): void {
    this.simpleApply(new LegalEntityRegistered(this.aggregateId, website, contactDetails));
  }

  update(website: string, contactDetails: ContactDetailsBody): void {
    this.simpleApply(new LegalEntityUpdated(this.aggregateId, website, contactDetails));
  }

  remove(): void {
    this.simpleApply(new LegalEntityRemoved(this.aggregateId));
  }

  onLegalEntityRegistered(eventMessage: EventMessage): void {
    const event: LegalEntityRegistered = getLegalEntityRegisteredEvent(eventMessage);

    this.state = new LegalEntityStateImpl(this.aggregateId);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onLegalEntityUpdated(eventMessage: EventMessage): void {
    const event: LegalEntityUpdated = getLegalEntityUpdatedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onLegalEntityRemoved(eventMessage: EventMessage): void {
    const event: LegalEntityRemoved = getLegalEntityDeletedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
