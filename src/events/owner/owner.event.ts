import { Event } from '../../event-store/event';

export abstract class OwnerEvent extends Event {

  readonly ownerId: string;

  constructor(ownerId: string) {
    super(ownerId);
    this.ownerId = ownerId;
  }

  streamRoot(): string {
    return 'owner';
  }

}
