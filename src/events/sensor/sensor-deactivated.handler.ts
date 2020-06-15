import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import * as clc from 'cli-color';
import { SensorDeactivated } from './sensor-deactivated.event';

@EventsHandler(SensorDeactivated)
export class SensorDeactivatedHandler
  implements IEventHandler<SensorDeactivated> {
  handle(event: SensorDeactivated) {
    console.log(clc.greenBright('SensorActivated...'));
  }
}