import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { observationGoalStreamRootValue } from '../../commons/events/observation-goal';
import { observationGoalEventType } from '../../commons/events/observation-goal';
import { ObservationGoalEvent } from '../../commons/events/observation-goal/observation-goal.event';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { ObservationGoalProcessor } from './observationgoal.processor';

@Injectable()
export class ObservationGoalEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: ObservationGoalProcessor,
    ) {
        super(`backend-${observationGoalStreamRootValue}-es`, `$ce-${observationGoalStreamRootValue}`, eventStore,
            checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): ObservationGoalEvent {
        return observationGoalEventType.getEvent(eventMessage) as ObservationGoalEvent;
    }

}
