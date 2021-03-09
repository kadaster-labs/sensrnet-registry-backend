import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { LegalEntityAggregate } from '../aggregates/legal-entity.aggregate';
import { legalEntityStreamRootValue } from '../events/legal-entity/legal-entity.stream';

@Injectable()
export class LegalEntityRepository {

  readonly streamRootValue: string;

  constructor(private readonly eventStore: EventStore) {
    this.streamRootValue = legalEntityStreamRootValue;
  }

  async get(aggregateId: string): Promise<LegalEntityAggregate> {
    const exists = await this.eventStore.exists(`${this.streamRootValue}-${aggregateId}`);
    if (!exists) {
      return undefined;
    }

    const events = await this.eventStore.getEvents(`${this.streamRootValue}-${aggregateId}`);
    const aggregate = new LegalEntityAggregate(aggregateId);
    aggregate.loadFromHistory(events);

    return aggregate;
  }

}
