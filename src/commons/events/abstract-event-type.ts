import { Logger } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { Event } from '../event-store/event';

export abstract class AbstractEventType {

  protected logger: Logger = new Logger(this.constructor.name);

  public supportedTypes: Record<string, any> = {};

  getEvent(incomingEvent: ESEvent): Event {
    const upcastFn = this.supportedTypes[incomingEvent.eventType];

    const localEvent = upcastFn ? upcastFn(incomingEvent) : undefined;
    if (!localEvent) {
      this.logger.warn(`Unsupported event received! [eventType: ${incomingEvent.eventType}]: ${JSON.stringify(incomingEvent)}`);
    }

    return localEvent;
  }

  public add(eventClass: Record<string, any>, upcastFn: (eventMessage) => Event | null): void {
    this.supportedTypes[eventClass.name] = upcastFn;
  }
}
