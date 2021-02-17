import { AbstractEventType } from '../abstract-event-type';
import { LegalEntityUpdated, getLegalEntityUpdatedEvent } from './updated';
import { LegalEntityDeleted, getLegalEntityDeletedEvent } from './deleted';
import { LegalEntityRegistered, getLegalEntityRegisteredEvent } from './registered';

class LegalEntityEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(LegalEntityRegistered, getLegalEntityRegisteredEvent);
    this.add(LegalEntityUpdated, getLegalEntityUpdatedEvent);
    this.add(LegalEntityDeleted, getLegalEntityDeletedEvent);
  }
}

export const legalEntityEventType = new LegalEntityEventType();
