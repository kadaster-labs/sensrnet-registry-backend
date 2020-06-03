import {AggregateRoot} from '@nestjs/cqrs';
import {Event} from './event';
import {isValidEvent} from './event-utils';
import {Logger} from '@nestjs/common';

export abstract class Aggregate extends AggregateRoot {

  protected logger: Logger = new Logger(this.constructor.name);

  simpleApply(event: Event) {
    super.apply(event.toEventMessage());
  }

  protected getEventName(event: object): string {
    if (isValidEvent(event)) {
      return event.eventType;
    } else {
      return super.getEventName(event);
    }
  }

}
