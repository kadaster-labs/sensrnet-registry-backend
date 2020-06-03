import {OwnerDeleted, OwnerRegistered, OwnerUpdated} from '../../../events/owner';
import {Aggregate} from '../../../event-store/aggregate';
import {OwnerState, OwnerStateImpl} from './owner-state';
import {Logger} from '@nestjs/common';

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

  private onOwnerRegistered(event: OwnerRegistered) {
    this.state = new OwnerStateImpl(this.aggregateId);

    this.state.nodeIds.push(event.nodeId);
    this.state.ssoIds.push(event.ssoId);
    this.state.emails.push(event.email);

    if (event.publicName) {
      this.state.publicNames.push(event.publicName);
    }

    this.state.names.push(event.name);

    if (event.companyName) {
      this.state.companyNames.push(event.companyName);
    }

    if (event.website) {
      this.state.websites.push(event.website);
    }
  }

  private onOwnerUpdated(event: OwnerUpdated) {
    if (event.ssoId) {
      this.state.ssoIds.push(event.ssoId);
    }

    if (event.email) {
      this.state.emails.push(event.email);
    }

    if (event.publicName) {
      this.state.publicNames.push(event.publicName);
    }

    if (event.name) {
      this.state.names.push(event.name);
    }

    if (event.companyName) {
      this.state.companyNames.push(event.companyName);
    }

    if (event.website) {
      this.state.websites.push(event.website);
    }
  }

  private onOwnerDeleted(event: OwnerDeleted) {
    // Called on Deleted.
    Logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

}
