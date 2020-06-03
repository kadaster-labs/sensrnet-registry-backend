import {Owner} from '../models/owner.model';
import {Injectable, Logger} from '@nestjs/common';
import {OwnerDeleted, OwnerRegistered, OwnerUpdated} from 'src/events/owner';
import {OwnerGateway} from '../owner.gateway';

@Injectable()
export class OwnerProcessor {
  constructor(
      private readonly ownerGateway: OwnerGateway,
  ) {
  }

  async process(event): Promise<void> {

    if (event instanceof OwnerRegistered) {
      await this.processCreated(event);
    } else if (event instanceof OwnerUpdated) {
      await this.processUpdated(event);
    } else if (event instanceof OwnerDeleted) {
      await this.processDeleted(event);
    } else {
      Logger.warn(`Caught unsupported event: ${event}`);
    }

    this.ownerGateway.emit(event.constructor.name, event);
  }

  async processCreated(event: OwnerRegistered): Promise<void> {
    const ownerInstance = new Owner({
      _id: event.ownerId,
      nodeId: event.nodeId,
      ssoId: event.ssoId,
      email: event.email,
      publicName: event.publicName,
      name: event.name,
      companyName: event.companyName,
      website: event.website,
    });
    await ownerInstance.save();
  }

  async processUpdated(event: OwnerUpdated): Promise<void> {
    let ownerData = {};
    if (event.ssoId) {
      ownerData = {...ownerData, ssoId: event.ssoId};
    }
    if (event.email) {
      ownerData = {...ownerData, email: event.email};
    }
    if (event.publicName) {
      ownerData = {...ownerData, publicName: event.publicName};
    }
    if (event.name) {
      ownerData = {...ownerData, name: event.name};
    }
    if (event.companyName) {
      ownerData = {...ownerData, companyName: event.companyName};
    }
    if (event.website) {
      ownerData = {...ownerData, website: event.website};
    }

    Owner.updateOne({_id: event.ownerId}, ownerData, (err) => {
      if (err) {
        Logger.error('Error while updating projection.');
      }
    });
  }

  async processDeleted(event: OwnerDeleted): Promise<void> {
    Owner.deleteOne({_id: event.aggregateId}, (err) => {
      if (err) {
        Logger.error('Error while deleting projection.');
      }
    });
  }

}
