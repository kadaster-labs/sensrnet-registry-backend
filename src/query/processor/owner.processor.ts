import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Owner } from '../data/owner.interface';
import { OwnerGateway } from '../gateway/owner.gateway';
import { AbstractProcessor } from './abstract.processor';
import { OwnerEvent } from '../../core/events/owner/owner.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { OwnerDeleted, OwnerRegistered, OwnerUpdated } from '../../core/events/owner';

@Injectable()
export class OwnerProcessor extends AbstractProcessor {
  /* This processor processes owner events. Events like soft-delete are not handled because they do not need to be processed. */

  constructor(
      eventStore: EventStorePublisher,
      private readonly ownerGateway: OwnerGateway,
      @InjectModel('Owner') private ownerModel: Model<Owner>,
  ) {
    super(eventStore);
  }

  async process(event: OwnerEvent): Promise<void> {
    let result;
    if (event instanceof OwnerRegistered) {
      await this.processCreated(event);
      result = event;
    } else if (event instanceof OwnerUpdated) {
      await this.processUpdated(event);
      result = event;
    } else if (event instanceof OwnerDeleted) {
      await this.processDeleted(event);
      result = event;
    }

    if (result) {
      this.ownerGateway.emit(event.constructor.name, result);
    }
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
    if (AbstractProcessor.isDefined(event.organisationName)) {
      ownerData = {...ownerData, organisationName: event.organisationName};
    }
    if (AbstractProcessor.isDefined(event.website)) {
      ownerData = {...ownerData, website: event.website};
    }
    if (AbstractProcessor.isDefined(event.contactName)) {
      ownerData = {...ownerData, name: event.contactName};
    }
    if (AbstractProcessor.isDefined(event.contactEmail)) {
      ownerData = {...ownerData, contactEmail: event.contactEmail};
    }
    if (AbstractProcessor.isDefined(event.contactPhone)) {
      ownerData = {...ownerData, contactPhone: event.contactPhone};
    }

    this.ownerModel.updateOne({_id: event.ownerId}, ownerData, (err) => {
      if (err) {
        this.logger.error('Error while updating owner projection.');
      }
    });
  }

  async processDeleted(event: OwnerDeleted): Promise<void> {
    this.ownerModel.deleteOne({_id: event.aggregateId}, (err) => {
      if (err) {
        this.logger.error('Error while deleting owner projection.');
      }
    });

    const eventMessage = event.toEventMessage();
    await this.eventStore.deleteStream(eventMessage.streamId);
  }
}
