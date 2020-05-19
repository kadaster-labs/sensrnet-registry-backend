import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SensorUpdatedEvent, SensorOwnerUpdatedEvent } from '../impl/sensor-updated.event';


@EventsHandler(SensorUpdatedEvent)
export class SensorUpdatedHandler
  implements IEventHandler<SensorUpdatedEvent> {
  handle(event: SensorUpdatedEvent) {
    Logger.log(event, 'SensorUpdatedEvent');
  }
}

@EventsHandler(SensorOwnerUpdatedEvent)
export class SensorOwnershipTransferredHandler
  implements IEventHandler<SensorOwnerUpdatedEvent> {
  handle(event: SensorOwnerUpdatedEvent) {
    Logger.log(event, 'SensorOwnerTransferredEvent');
  }
}
