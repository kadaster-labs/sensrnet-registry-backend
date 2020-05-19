import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { OwnerRemovedEvent } from '../impl/owner-removed.event';


@EventsHandler(OwnerRemovedEvent)
export class OwnerRemovedHandler
  implements IEventHandler<OwnerRemovedEvent> {
  handle(event: OwnerRemovedEvent) {
    Logger.log(event, 'OwnerRemovedEvent');
  }
}
