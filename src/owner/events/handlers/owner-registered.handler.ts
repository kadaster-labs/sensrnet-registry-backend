import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { OwnerRegisteredEvent } from '../impl/owner-registered.event';


@EventsHandler(OwnerRegisteredEvent)
export class OwnerRegisteredHandler
  implements IEventHandler<OwnerRegisteredEvent> {
  handle(event: OwnerRegisteredEvent) {
    Logger.log(event, 'OwnerRegisteredEvent');
  }
}
