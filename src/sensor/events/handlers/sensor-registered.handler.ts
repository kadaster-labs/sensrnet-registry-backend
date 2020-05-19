import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SensorRegisteredEvent } from '../impl/sensor-registered.event';


@EventsHandler(SensorRegisteredEvent)
export class SensorRegisteredHandler
  implements IEventHandler<SensorRegisteredEvent> {
  handle(event: SensorRegisteredEvent) {
    Logger.log(event, 'SensorRegisteredEvent');
  }
}
