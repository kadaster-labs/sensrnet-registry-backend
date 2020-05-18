import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SensorDeletedEvent } from '../impl/sensor-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(SensorDeletedEvent)
export class SensorDeletedHandler
  implements IEventHandler<SensorDeletedEvent> {
  handle(event: SensorDeletedEvent) {
    Logger.log(event, 'SensorDeletedEvent'); // write here
  }
}
