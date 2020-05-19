import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { OwnerUpdatedEvent } from '../impl/owner-updated.event';


@EventsHandler(OwnerUpdatedEvent)
export class OwnerUpdatedHandler
  implements IEventHandler<OwnerUpdatedEvent> {
  handle(event: OwnerUpdatedEvent) {
    Logger.log(event, 'OwnerUpdatedEvent');
  }
}
