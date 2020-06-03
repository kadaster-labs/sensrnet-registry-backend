import {AggregateRoot} from '@nestjs/cqrs';
import {Event} from './event';

export abstract class Aggregate extends AggregateRoot {

  simpleApply(event: Event) {
    super.apply(event.toEventMessage());
  }

}
