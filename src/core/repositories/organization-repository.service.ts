import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { OrganizationAggregate } from '../aggregates/organizationAggregate';

@Injectable()
export class OrganizationRepository {
  constructor(
      private readonly eventStore: EventStore,
      ) {}

  async get(aggregateId: string): Promise<OrganizationAggregate> {
    const exists = await this.eventStore.exists(`organization-${aggregateId}`);
    if (!exists) {
      return undefined;
    }

    const events = await this.eventStore.getEvents(`organization-${aggregateId}`);
    const aggregate = new OrganizationAggregate(aggregateId);
    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
