import {AggregateRoot} from '@nestjs/cqrs';
import {Event} from './event';
import {isValidEvent} from './event-utils';

export abstract class Aggregate extends AggregateRoot {

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
