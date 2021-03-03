import { AbstractEventType } from '../abstract-event-type';
import { LegalEntityUpdated, getLegalEntityUpdatedEvent } from './updated';
import { LegalEntityRemoved, getLegalEntityDeletedEvent } from './removed';
import { LegalEntityRegistered, getLegalEntityRegisteredEvent } from './registered';

class LegalEntityEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(LegalEntityRegistered, getLegalEntityRegisteredEvent);
    this.add(LegalEntityUpdated, getLegalEntityUpdatedEvent);
    this.add(LegalEntityRemoved, getLegalEntityDeletedEvent);
  }
}

export const legalEntityEventType = new LegalEntityEventType();
