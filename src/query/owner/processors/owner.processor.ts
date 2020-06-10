import {Owner} from '../owner.interface';
import {OwnerGateway} from '../owner.gateway';
import {Injectable, Logger} from '@nestjs/common';
import {OwnerDeleted, OwnerRegistered, OwnerUpdated} from 'src/events/owner';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class OwnerProcessor {
  constructor(
      @InjectModel('Owner') private ownerModel: Model<Owner>,
      private readonly ownerGateway: OwnerGateway,
  ) {
  }

  protected logger: Logger = new Logger(this.constructor.name);

  async process(event): Promise<void> {

    if (event instanceof OwnerRegistered) {
      await this.processCreated(event);
    } else if (event instanceof OwnerUpdated) {
      await this.processUpdated(event);
    } else if (event instanceof OwnerDeleted) {
      await this.processDeleted(event);
    } else {
      this.logger.warn(`Caught unsupported event: ${event}`);
    }

    this.ownerGateway.emit(event.constructor.name, event);
  }

  async processCreated(event: OwnerRegistered): Promise<void> {
    const ownerInstance = new this.ownerModel({
      _id: event.ownerId,
      nodeId: event.nodeId,
      organisationName: event.organisationName,
      website: event.website,
      name: event.name,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
    });
    await ownerInstance.save();
  }

  async processUpdated(event: OwnerUpdated): Promise<void> {
    let ownerData = {};
    if (event.organisationName) {
      ownerData = {...ownerData, organisationName: event.organisationName};
    }
    if (event.website) {
      ownerData = {...ownerData, website: event.website};
    }
    if (event.contactName) {
      ownerData = {...ownerData, contactName: event.contactName};
    }
    if (event.contactEmail) {
      ownerData = {...ownerData, contactEmail: event.contactEmail};
    }
    if (event.contactPhone) {
      ownerData = {...ownerData, contactPhone: event.contactPhone};
    }

    this.ownerModel.updateOne({_id: event.ownerId}, ownerData, (err) => {
      if (err) {
        this.logger.error('Error while updating projection.');
      }
    });
  }

  async processDeleted(event: OwnerDeleted): Promise<void> {
    this.ownerModel.deleteOne({_id: event.aggregateId}, (err) => {
      if (err) {
        this.logger.error('Error while deleting projection.');
      }
    });
  }

}
