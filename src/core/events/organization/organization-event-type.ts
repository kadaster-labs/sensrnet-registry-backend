import { Logger } from '@nestjs/common';
import { OrganizationDeleted, OrganizationRegistered, OrganizationUpdated } from './index';

class OrganizationEventType {
  constructor() {
    this.add(OrganizationRegistered);
    this.add(OrganizationUpdated);
    this.add(OrganizationDeleted);
  }

  private supportedTypes: { [key: string]: any; } = {};

  getType(eventTypeName: string) {
    const t = this.supportedTypes[eventTypeName];
    if (!t) {
      Logger.warn(`Unsupported event received! eventType: ${eventTypeName}`);
    }
    return t;
  }

  private add(event: any) {
    this.supportedTypes[event.name] = event;
  }

}

export const organizationEventType = new OrganizationEventType();
