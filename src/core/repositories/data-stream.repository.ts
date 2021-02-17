import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { DataStreamAggregate } from '../aggregates/data-stream.aggregate';

@Injectable()
export class DataStreamRepository {
  constructor(private readonly eventStore: EventStore) {}

  async get(aggregateId: string): Promise<DataStreamAggregate> {
    const exists = await this.eventStore.exists(`datastream-${aggregateId}`);

    let aggregate;
    if (!exists) {
      aggregate = undefined;
    } else {
      const events = await this.eventStore.getEvents(`datastream-${aggregateId}`);
      aggregate = new DataStreamAggregate(aggregateId);
      aggregate.loadFromHistory(events);
    }

    return aggregate;
  }
}
