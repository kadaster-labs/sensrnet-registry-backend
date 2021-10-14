import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { ObservationGoalProcessor } from '../../commons/event-processing/observation-goal-processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import {
    ObservationGoalRegistered,
    ObservationGoalRemoved,
    observationGoalStreamRootValue,
    ObservationGoalUpdated,
} from '../../commons/events/observation-goal';
import { ObservationGoalEvent } from '../../commons/events/observation-goal/observation-goal.event';
import { ObservationGoalEsListener } from './observation-goal.es.listener';

@Injectable()
export class QueryObservationGoalProcessor extends ObservationGoalProcessor {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly observationGoalListener: ObservationGoalEsListener,
    ) {
        super(`backend-${observationGoalStreamRootValue}-es`, eventStore, checkpointService);
    }

    async process(event: ObservationGoalEvent): Promise<void> {
        if (event instanceof ObservationGoalRegistered) {
            await this.observationGoalListener.processObservationGoalRegistered(event);
        } else if (event instanceof ObservationGoalUpdated) {
            await this.observationGoalListener.processObservationGoalUpdated(event);
        } else if (event instanceof ObservationGoalRemoved) {
            await this.observationGoalListener.processObservationGoalRemoved(event);
        }
    }
}
