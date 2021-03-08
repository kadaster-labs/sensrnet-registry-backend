import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { ObservationGoalAggregate } from '../aggregates/observation-goal.aggregate';

@Injectable()
export class ObservationGoalRepository {
  constructor(
      private readonly eventStore: EventStore,
      ) {}

  async get(aggregateId: string): Promise<ObservationGoalAggregate> {
    const exists = await this.eventStore.exists(`observationgoal-${aggregateId}`);
    if (!exists) {
      return undefined;
    }

    const events = await this.eventStore.getEvents(`observationgoal-${aggregateId}`);
    const aggregate = new ObservationGoalAggregate(aggregateId);
    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
