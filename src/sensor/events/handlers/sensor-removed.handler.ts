import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SensorRemovedEvent } from '../impl/sensor-removed.event';


@EventsHandler(SensorRemovedEvent)
export class SensorRemovedHandler
  implements IEventHandler<SensorRemovedEvent> {
  handle(event: SensorRemovedEvent) {
    Logger.log(event, 'SensorRemovedEvent');
  }
}
