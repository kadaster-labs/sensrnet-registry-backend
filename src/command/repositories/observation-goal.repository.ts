import { Injectable } from '@nestjs/common';
import { EventStore } from '../../commons/event-store/event-store';
import { observationGoalStreamRootValue } from '../../commons/events/observation-goal';
import { ObservationGoalAggregate } from '../aggregates/observation-goal.aggregate';

@Injectable()
export class ObservationGoalRepository {
    readonly streamRootValue: string;

    constructor(private readonly eventStore: EventStore) {
        this.streamRootValue = observationGoalStreamRootValue;
    }

    async get(aggregateId: string): Promise<ObservationGoalAggregate> {
        const exists = await this.eventStore.exists(`${this.streamRootValue}-${aggregateId}`);
        if (!exists) {
            return undefined;
        }

        const events = await this.eventStore.getEvents(`${this.streamRootValue}-${aggregateId}`);
        const aggregate = new ObservationGoalAggregate(aggregateId);
        aggregate.loadFromHistory(events);

        return aggregate;
    }
}
