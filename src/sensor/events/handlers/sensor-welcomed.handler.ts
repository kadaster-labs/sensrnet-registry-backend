import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SensorWelcomedEvent } from '../impl/sensor-welcomed.event';
import { Logger } from '@nestjs/common';

@EventsHandler(SensorWelcomedEvent)
export class SensorWelcomedHandler
  implements IEventHandler<SensorWelcomedEvent> {
  handle(event: SensorWelcomedEvent) {
    Logger.log(event, 'SensorWelcomedEvent'); // write here
  }
}
