import {Aggregate} from '../../../event-store/aggregate';
import {OwnerState, OwnerStateImpl} from './owner-state';
import {EventMessage} from '../../../event-store/event-message';
import {OwnerDeleted, OwnerRegistered, OwnerUpdated} from '../../../events/owner';

export class OwnerAggregate extends Aggregate {
  state!: OwnerState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  register(nodeId: string, organisationName: string, website: string, name: string,
           contactEmail: string, contactPhone: string) {
    this.simpleApply(new OwnerRegistered(this.aggregateId, nodeId, organisationName, website,
        name, contactEmail, contactPhone));
  }

  update(organisationName: string, website: string, contactName: string, contactEmail: string,
         contactPhone: string) {
    this.simpleApply(new OwnerUpdated(this.aggregateId, organisationName, website, contactName,
        contactEmail, contactPhone));
  }

  delete() {
    this.simpleApply(new OwnerDeleted(this.aggregateId));
  }

  private onOwnerRegistered(eventMessage: EventMessage) {
    const event: OwnerRegistered = eventMessage.data as OwnerRegistered;
    this.state = new OwnerStateImpl(this.aggregateId);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onOwnerUpdated(eventMessage: EventMessage) {
    const event: OwnerUpdated = eventMessage.data as OwnerUpdated;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  private onOwnerDeleted(eventMessage: EventMessage) {
    const event: OwnerDeleted = eventMessage.data as OwnerDeleted;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

}
