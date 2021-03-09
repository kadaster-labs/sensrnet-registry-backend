import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { ObservationGoalAggregate } from '../aggregates/observation-goal.aggregate';
import { observationGoalEventType } from '../events/observation-goal/observation-goal-event-type';

@Injectable()
export class ObservationGoalRepository {

  readonly streamRootValue: string;

  constructor(private readonly eventStore: EventStore) {
    this.streamRootValue = observationGoalEventType.streamRootValue;
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
