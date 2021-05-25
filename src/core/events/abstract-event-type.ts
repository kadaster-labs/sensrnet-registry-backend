import { Logger } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { Event } from '../../event-store/event';

export abstract class AbstractEventType {

  public supportedTypes: Record<string, any> = {};

  getEvent(eventTypeName: ESEvent): Event {
    const upcastFn = this.supportedTypes[eventTypeName.eventType];

    const event = upcastFn ? upcastFn(eventTypeName) : undefined;
    if (!event) {
      Logger.warn(`Unsupported event received! eventType: ${eventTypeName.eventType}`);
    }

    return event;
  }

  public add(eventClass: Record<string, any>, upcastFn: (eventMessage) => Event | null): void {
    this.supportedTypes[eventClass.name] = upcastFn;
  }
}
