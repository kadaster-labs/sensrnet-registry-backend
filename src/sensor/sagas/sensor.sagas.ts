import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Injectable, Logger } from '@nestjs/common';
import { ICommand, EventObservable } from '@nestjs/cqrs';
import { SensorRegisteredEvent } from '../events/impl/sensor-registered.event';


@Injectable()
export class SensorSagas {
  // TODO
  sensorCreated = (events$: EventObservable<any>): Observable<ICommand> => {
    return events$
      .ofType(SensorRegisteredEvent)
      .pipe(
        delay(1000),
        map(event => {
          Logger.log('Inside [SensorSagas] Saga', 'SensorSagas');
          const id = event.dto[0].id[0];
          return id;
        }),
      );
  }
}
