import { Event } from '../../../event-store/event';

export class OwnerDeleted extends Event {

  constructor(aggregatedId: string) {
    super(`owner-${aggregatedId}`, OwnerDeleted.name, {
      ownerId: aggregatedId,
    });
  }
}
