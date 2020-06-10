import {UserRegistered} from '.';
import {Logger} from '@nestjs/common';

class UserEventType {
  constructor() {
    this.add(UserRegistered);
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

export const userEventType = new UserEventType();
