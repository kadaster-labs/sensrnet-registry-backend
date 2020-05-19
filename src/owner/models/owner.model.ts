import { AggregateRoot } from '@nestjs/cqrs';
import { OwnerRemovedEvent } from '../events/impl/owner-removed.event';
import { OwnerUpdatedEvent } from '../events/impl/owner-updated.event';
import { OwnerRegisteredEvent } from '../events/impl/owner-registered.event';


export class Owner extends AggregateRoot {
  [x: string]: any;

  constructor(private readonly id: string | undefined) {
    super();
  }

  setData(data) {
    this.data = data;
  }

  registerOwner() {
    this.apply(new OwnerRegisteredEvent(this.data));
  }

  updateOwner() {
    this.apply(new OwnerUpdatedEvent(this.data));
  }

  removeOwner() {
    this.apply(new OwnerRemovedEvent(this.id));
  }
}
