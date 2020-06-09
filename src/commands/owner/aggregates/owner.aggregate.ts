import {OwnerDeleted, OwnerRegistered, OwnerUpdated} from '../../../events/owner';
import {Aggregate} from '../../../event-store/aggregate';
import {OwnerState, OwnerStateImpl} from './owner-state';
import {EventMessage} from '../../../event-store/event-message';

export class OwnerAggregate extends Aggregate {
  state!: OwnerState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  register(nodeId: string, ssoId: string, email: string, publicName: string, name: string,
           companyName: string, website: string) {
    this.simpleApply(new OwnerRegistered(this.aggregateId, nodeId, ssoId, email, publicName,
        name, companyName, website));
  }

  update(ssoId: string, email: string, publicName: string, name: string,
         companyName: string, website: string) {
    this.simpleApply(new OwnerUpdated(this.aggregateId, ssoId, email, publicName, name,
        companyName, website));
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
