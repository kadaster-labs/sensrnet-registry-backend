import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import * as clc from 'cli-color';
import { SensorActivated } from './sensor-activated.event';

@EventsHandler(SensorActivated)
export class SensorActivatedHandler
  implements IEventHandler<SensorActivated> {
  handle(event: SensorActivated) {
    console.log(clc.greenBright('SensorActivated...'));
  }
}