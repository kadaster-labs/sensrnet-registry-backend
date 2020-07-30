import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { SensorAggregate } from '../aggregates/sensor.aggregate';

@Injectable()
export class SensorRepository {
  constructor(private readonly eventStore: EventStore) {}

  async get(aggregateId: string): Promise<SensorAggregate> {
    const exists = await this.eventStore.exists(`sensor-${aggregateId}`);

    let aggregate;
    if (!exists) {
      aggregate = undefined;
    } else {
      const events = await this.eventStore.getEvents(`sensor-${aggregateId}`);
      aggregate = new SensorAggregate(aggregateId);
      aggregate.loadFromHistory(events);
    }

    return aggregate;
  }
}
