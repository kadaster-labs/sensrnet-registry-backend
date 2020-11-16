import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractProcessor } from './abstract.processor';
import { Organization } from '../data/organization.interface';
import { OrganizationGateway } from '../gateway/organization.gateway';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { OrganizationEvent } from '../../core/events/organization/organizationEvent';
import { OrganizationDeleted, OrganizationRegistered, OrganizationUpdated } from '../../core/events/organization';

@Injectable()
export class OrganizationProcessor extends AbstractProcessor {
  /* This processor processes owner events. Events like soft-delete are not handled because they do not need to be processed. */

  constructor(
      eventStore: EventStorePublisher,
      private readonly ownerGateway: OrganizationGateway,
      @InjectModel('Organization') private model: Model<Organization>,
  ) {
    super(eventStore);
  }

  async process(event: OrganizationEvent, originSync: boolean): Promise<void> {
    let result;
    if (event instanceof OrganizationRegistered) {
      await this.processCreated(event, originSync);
      result = event;
    } else if (event instanceof OrganizationUpdated) {
      await this.processUpdated(event);
      result = event;
    } else if (event instanceof OrganizationDeleted) {
      await this.processDeleted(event);
      result = event;
    }

    if (result) {
      this.ownerGateway.emit(event.constructor.name, result);
    }
  }

  async processCreated(event: OrganizationRegistered, originSync: boolean): Promise<void> {
    const organizationInstance = new this.model({
      _id: event.aggregateId,
      website: event.website,
      originSync: !!originSync,
      contactName: event.contactName,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
    });
    await organizationInstance.save();
  }

  async processUpdated(event: OrganizationUpdated): Promise<void> {
    let organizationData = {};
    if (AbstractProcessor.isDefined(event.website)) {
      organizationData = {website: event.website, ...organizationData};
    }
    if (AbstractProcessor.isDefined(event.contactName)) {
      organizationData = {contactName: event.contactName, ...organizationData};
    }
    if (AbstractProcessor.isDefined(event.contactEmail)) {
      organizationData = {contactEmail: event.contactEmail, ...organizationData};
    }
    if (AbstractProcessor.isDefined(event.contactPhone)) {
      organizationData = {contactPhone: event.contactPhone, ...organizationData};
    }

    this.model.updateOne({_id: event.aggregateId}, organizationData, (err) => {
      if (err) {
        this.logger.error('Error while updating owner projection.');
      }
    });
  }

  async processDeleted(event: OrganizationDeleted): Promise<void> {
    this.model.deleteOne({_id: event.aggregateId}, (err) => {
      if (err) {
        this.logger.error('Error while deleting owner projection.');
      }
    });

    const eventMessage = event.toEventMessage();
    await this.eventStore.deleteStream(eventMessage.streamId);
  }
}
