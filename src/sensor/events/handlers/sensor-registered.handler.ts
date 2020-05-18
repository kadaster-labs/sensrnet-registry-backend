
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SensorRegisteredEvent } from '../impl/sensor-registered.event';
import { Logger } from '@nestjs/common';

@EventsHandler(SensorRegisteredEvent)
export class SensorCreatedHandler
  implements IEventHandler<SensorRegisteredEvent> {
  handle(event: SensorRegisteredEvent) {
    Logger.log(event, 'SensorRegisteredEvent');
  }
}
