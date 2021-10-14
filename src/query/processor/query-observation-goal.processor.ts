import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { ObservationGoalProcessor } from '../../commons/event-processing/observation-goal-processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { observationGoalStreamRootValue } from '../../commons/events/observation-goal';

@Injectable()
export class QueryObservationGoalProcessor extends ObservationGoalProcessor {
    constructor(eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(`backend-${observationGoalStreamRootValue}-es`, eventStore, checkpointService);
    }
}
