import { Injectable } from '@nestjs/common';
import { Saga, ofType, ICommand } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { EmitUpdateCommand } from '../../commands/sensor/commands/emitupdate.command';
import { SensorDeactivated, SensorActivated } from '../../events/sensor';

@Injectable()
export class SensorSagas {
    @Saga()
    sensorActivated = (events$: Observable<any>): Observable<ICommand> => {

        return events$
            .pipe(
                ofType(SensorActivated),
                delay(1000),
                map((event) => {
                    console.log(clc.redBright('Inside [HeroesGameSagas] Saga'));
                    return new EmitUpdateCommand('', '');
                }),
            );
    }

    @Saga()
    sensorDeactivated = (events$: Observable<any>): Observable<ICommand> => {

        return events$.pipe(
            ofType(SensorDeactivated),
            map((event) => new EmitUpdateCommand('', '')),
        );
    }
}
