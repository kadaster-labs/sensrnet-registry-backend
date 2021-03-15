import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { observationGoalStreamRootValue } from '../../core/events/observation-goal';
import { observationGoalEventType } from '../../core/events/observation-goal/observation-goal-event-type';
import { ObservationGoalEvent } from '../../core/events/observation-goal/observation-goal.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { AbstractEsListener } from './abstract.es.listener';
import { ObservationGoalProcessor } from './observationgoal.processor';

@Injectable()
export class ObservationGoalEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: ObservationGoalProcessor,
    ) {
        super(`backend-${observationGoalStreamRootValue}-es`, `$ce-${observationGoalStreamRootValue}`, eventStore, checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): ObservationGoalEvent {
        return observationGoalEventType.getEvent(eventMessage) as ObservationGoalEvent;
    }

}
