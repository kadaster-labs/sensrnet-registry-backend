import { AbstractEventType } from '../abstract-event-type';
import { OrganizationUpdated, getOrganizationUpdatedEvent } from './updated';
import { OrganizationDeleted, getOrganizationDeletedEvent } from './deleted';
import { OrganizationRegistered, getOrganizationRegisteredEvent } from './registered';

class OrganizationEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(OrganizationRegistered, getOrganizationRegisteredEvent);
    this.add(OrganizationUpdated, getOrganizationUpdatedEvent);
    this.add(OrganizationDeleted, getOrganizationDeletedEvent);
  }
}

export const organizationEventType = new OrganizationEventType();
