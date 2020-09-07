import { Event } from './event';
import { Logger } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { isValidEvent } from './event-utils';

export abstract class Aggregate extends AggregateRoot {

  protected logger: Logger = new Logger(this.constructor.name);

  simpleApply(event: Event): void {
    super.apply(event.toEventMessage());
  }

  protected getEventName(event: Event): string {
    if (isValidEvent(event)) {
      return event.eventType;
    } else {
      return super.getEventName(event);
    }
  }
}
