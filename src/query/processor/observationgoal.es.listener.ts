import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Event as ESEvent } from 'geteventstore-promise';
import { Connection } from 'mongoose';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import {
    observationGoalEventStreamName,
    observationGoalEventType,
    observationGoalStreamRootValue,
} from '../../commons/events/observation-goal';
import { ObservationGoalEvent } from '../../commons/events/observation-goal/observation-goal.event';

@Injectable()
export class ObservationGoalEsListener extends AbstractEsListener {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        @InjectConnection() protected readonly connection: Connection,
    ) {
        super(
            `backend-${observationGoalStreamRootValue}-es`,
            `${observationGoalEventStreamName}`,
            eventStore,
            checkpointService,
            connection,
        );
    }

    parseEvent(eventMessage: ESEvent): ObservationGoalEvent {
        return observationGoalEventType.getEvent(eventMessage) as ObservationGoalEvent;
    }
}
