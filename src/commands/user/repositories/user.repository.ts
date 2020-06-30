import { Injectable } from '@nestjs/common';
import { UserAggregate } from '../aggregates/user.aggregate';
import { EventStore } from '../../../event-store/event-store';

@Injectable()
export class UserRepository {
  constructor(private readonly eventStore: EventStore) {}

  async get(aggregateId: string): Promise<UserAggregate> {
    const exists = await this.eventStore.exists(`user-${aggregateId}`);

    if (!exists) {
      return undefined;
    }

    const events = await this.eventStore.getEvents(`user-${aggregateId}`);
    const aggregate = new UserAggregate(aggregateId);
    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
