import { Injectable } from "@nestjs/common";
import { EventStore } from "../../event-store/event-store";
import { OwnerAggregate } from "../aggregates/owner.aggregate";


@Injectable()
export class OwnerRepository {
  constructor(private readonly eventStore: EventStore) {}

  async get(aggregateId: string): Promise<OwnerAggregate> {
    const exists = await this.eventStore.exists(`owner-${aggregateId}`);

    if (!exists) {
      return undefined;
    }

    const events = await this.eventStore.getEvents(`owner-${aggregateId}`);
    const aggregate = new OwnerAggregate(aggregateId);
    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
