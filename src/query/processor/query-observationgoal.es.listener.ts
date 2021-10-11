import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { ObservationGoalEsListener } from '../../commons/event-processing/observationgoal.es.listener';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { observationGoalStreamRootValue } from '../../commons/events/observation-goal';

@Injectable()
export class QueryObservationGoalEsListener extends ObservationGoalEsListener {
    constructor(eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(`backend-${observationGoalStreamRootValue}-es`, eventStore, checkpointService);
    }
}
