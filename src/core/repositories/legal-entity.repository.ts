import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { LegalEntityAggregate } from '../aggregates/legal-entity.aggregate';

@Injectable()
export class LegalEntityRepository {
  constructor(
      private readonly eventStore: EventStore,
      ) {}

  async get(aggregateId: string): Promise<LegalEntityAggregate> {
    const exists = await this.eventStore.exists(`legalentity-${aggregateId}`);
    if (!exists) {
      return undefined;
    }

    const events = await this.eventStore.getEvents(`legalentity-${aggregateId}`);
    const aggregate = new LegalEntityAggregate(aggregateId);
    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
