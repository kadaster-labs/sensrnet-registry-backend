import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { observationGoalEventStreamName, observationGoalEventType } from '../events/observation-goal';
import { ObservationGoalEvent } from '../events/observation-goal/observation-goal.event';
import { AbstractProcessor } from './abstract.processor';
import { CheckpointService } from './checkpoint/checkpoint.service';

@Injectable()
export abstract class ObservationGoalProcessor extends AbstractProcessor {
    constructor(checkpointId: string, eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(checkpointId, `${observationGoalEventStreamName}`, eventStore, checkpointService);
    }

    parseEvent(eventMessage: ESEvent): ObservationGoalEvent {
        return observationGoalEventType.getEvent(eventMessage) as ObservationGoalEvent;
    }
}
