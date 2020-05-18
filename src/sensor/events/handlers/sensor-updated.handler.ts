import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SensorUpdatedEvent } from '../impl/sensor-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(SensorUpdatedEvent)
export class SensorUpdatedHandler
  implements IEventHandler<SensorUpdatedEvent> {
  handle(event: SensorUpdatedEvent) {
    Logger.log(event, 'SensorUpdatedEvent'); // write here
  }
}
