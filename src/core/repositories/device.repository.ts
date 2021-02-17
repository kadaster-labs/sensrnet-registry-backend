import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { DeviceAggregate } from '../aggregates/device.aggregate';

@Injectable()
export class DeviceRepository {
  constructor(
      private readonly eventStore: EventStore,
      ) {}

  async get(aggregateId: string): Promise<DeviceAggregate> {
    const exists = await this.eventStore.exists(`device-${aggregateId}`);
    if (!exists) {
      return undefined;
    }

    const events = await this.eventStore.getEvents(`device-${aggregateId}`);
    const aggregate = new DeviceAggregate(aggregateId);
    aggregate.loadFromHistory(events);

    return aggregate;
  }
}