import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { AbstractEsListener } from './abstract.es.listener';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { ObservationGoalProcessor } from './observationgoal.processor';
import { observationGoalEventType } from '../../core/events/observation-goal/observation-goal-event-type';
import { ObservationGoalEvent } from '../../core/events/observation-goal/observation-goal.event';

@Injectable()
export class ObservationGoalEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: ObservationGoalProcessor,
    ) {
        super('backend-observationgoal-es', '$ce-observationgoal', eventStore, checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): ObservationGoalEvent {
        return observationGoalEventType.getEvent(eventMessage) as ObservationGoalEvent;
    }
}
