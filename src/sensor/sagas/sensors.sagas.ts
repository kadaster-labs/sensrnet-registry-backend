import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ICommand, EventObservable } from '@nestjs/cqrs';
import { SensorRegisteredEvent } from '../events/impl/sensor-registered.event';
import { WelcomeSensorCommand } from '../commands/impl/welcome-sensor.command';
import { delay, map } from 'rxjs/operators';

@Injectable()
export class SensorSagas {
  sensorCreated = (events$: EventObservable<any>): Observable<ICommand> => {
    return events$
      .ofType(SensorRegisteredEvent)
      .pipe(
        delay(1000),
        map(event => {
          Logger.log('Inside [SensorSagas] Saga', 'SensorSagas');
          const sensorId = event.sensorDto[0].sensorId[0];
          return new WelcomeSensorCommand(sensorId);
        }),
      );
  }
}
