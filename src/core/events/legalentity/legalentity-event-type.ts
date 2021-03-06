import { AbstractEventType } from '../abstract-event-type';
import { OrganizationUpdated, getOrganizationUpdatedEvent } from './updated';
import { OrganizationRemoved, getOrganizationDeletedEvent } from './removed';
import { OrganizationRegistered, getOrganizationRegisteredEvent } from './registered';

class LegalEntityEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(OrganizationRegistered, getOrganizationRegisteredEvent);
    this.add(OrganizationUpdated, getOrganizationUpdatedEvent);
    this.add(OrganizationRemoved, getOrganizationDeletedEvent);
  }
}

export const legalEntityEventType = new LegalEntityEventType();
