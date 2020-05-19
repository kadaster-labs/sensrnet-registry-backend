import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Injectable, Logger } from '@nestjs/common';
import { ICommand, EventObservable } from '@nestjs/cqrs';
import { OwnerRegisteredEvent } from '../events/impl/owner-registered.event';


@Injectable()
export class OwnerSagas {
  ownerCreated = (events$: EventObservable<any>): Observable<ICommand> => {
    return events$
      .ofType(OwnerRegisteredEvent)
      .pipe(
        delay(1000),
        map(event => {
          Logger.log('Inside [OwnerSagas] Saga', 'OwnerSagas');
          const id = event.dto[0].id[0];
          return id;
        }),
      );
  }
}
