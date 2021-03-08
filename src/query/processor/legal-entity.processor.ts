import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractProcessor } from './abstract.processor';
import { ILegalEntity } from '../model/legal-entity.model';
import { LegalEntityGateway } from '../gateway/legal-entity.gateway';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { LegalEntityEvent } from '../../core/events/legal-entity/legal-entity.event';
import { LegalEntityRemoved, OrganizationRegistered, OrganizationUpdated } from '../../core/events/legal-entity';
import { IRelation } from '../model/relation.model';
import { PublicContactDetailsAdded } from '../../core/events/legal-entity/contact-details/added';
import { ContactDetailsUpdated } from '../../core/events/legal-entity/contact-details/updated';
import { ContactDetailsRemoved } from '../../core/events/legal-entity/contact-details/removed';
import { IDevice } from '../model/device.model';

@Injectable()
export class LegalEntityProcessor extends AbstractProcessor {
  /* This processor processes legal entity events. Events like soft-delete are not handled because they do not need to be processed. */

  constructor(
      eventStore: EventStorePublisher,
      private readonly legalEntityGateway: LegalEntityGateway,
      @InjectModel('Device') public deviceModel: Model<IDevice>,
      @InjectModel('LegalEntity') private model: Model<ILegalEntity>,
      @InjectModel('Relation') public relationModel: Model<IRelation>,
  ) {
    super(eventStore, relationModel);
  }

  async process(event: LegalEntityEvent, originSync: boolean): Promise<void> {
    let result;
    if (event instanceof OrganizationRegistered) {
      await this.processRegistered(event, originSync);
      result = event;
    } else if (event instanceof OrganizationUpdated) {
      await this.processUpdated(event);
      result = event;
    } else if (event instanceof LegalEntityRemoved) {
      await this.processDeleted(event);
      result = event;
    } else if (event instanceof PublicContactDetailsAdded) {
      await this.processPublicContactDetailsAdded(event);
    } else if (event instanceof ContactDetailsUpdated) {
      await this.processContactDetailsUpdated(event);
    } else if (event instanceof ContactDetailsRemoved) {
      await this.processContactDetailsRemoved(event);
    }

    if (result) {
      this.legalEntityGateway.emit(event.constructor.name, result);
    }
  }

  async processRegistered(event: OrganizationRegistered, originSync: boolean): Promise<ILegalEntity> {
    const legalEntityData: Record<string, any> = {
      _id: event.aggregateId,
      name: event.name,
      website: event.website,
      originSync: !!originSync,
    };

    let legalEntity;
    try {
      legalEntity = await new this.model(legalEntityData).save();
    } catch {
      this.errorCallback(event);
    }

    return legalEntity;
  }

  async processUpdated(event: OrganizationUpdated): Promise<void> {
    const legalEntityUpdate: Record<string, any> = {};
    if (AbstractProcessor.defined(event.name)) {
      legalEntityUpdate.name = event.name;
    }
    if (AbstractProcessor.defined(event.website)) {
      legalEntityUpdate.website = event.website;
    }

    try {
      await this.model.updateOne({_id: event.aggregateId}, { $set: legalEntityUpdate });
    } catch {
      this.errorCallback(event);
    }
  }

  async processDeleted(event: LegalEntityRemoved): Promise<void> {
    try {
      this.relationModel.deleteMany({legalEntityId: event.aggregateId});

      await this.model.deleteOne({_id: event.aggregateId});
      const legalEntityStreamName = LegalEntityEvent.getStreamName(LegalEntityEvent.streamRootValue, event.aggregateId);
      await this.eventStore.deleteStream(legalEntityStreamName);
    } catch {
      this.errorCallback(event);
    }
  }

  async processPublicContactDetailsAdded(event: PublicContactDetailsAdded): Promise<void> {
    const contactDetailsData = {
      _id: event.contactDetailsId,
      name: event.name,
      email: event.email,
      phone: event.phone,
      isPublic: true,
    };

    const legalEntityFilter = {
      '_id': event.legalEntityId,
      'contactDetails._id': {$ne: event.contactDetailsId},
    };

    try {
      await this.model.updateOne(legalEntityFilter, { $push: { contactDetails: contactDetailsData } });
    } catch {
      this.errorCallback(event);
    }
  }

  async processContactDetailsUpdated(event: ContactDetailsUpdated): Promise<void> {
    const contactDetailsFilter = {
      '_id': event.legalEntityId,
      'contactDetails._id': event.contactDetailsId,
    };

    const contactDetailsUpdate: Record<string, any> = {};
    if (AbstractProcessor.defined(event.name)) {
      contactDetailsUpdate['contactDetails.$.name'] = event.name;
    }
    if (AbstractProcessor.defined(event.email)) {
      contactDetailsUpdate['contactDetails.$.email'] = event.email;
    }
    if (AbstractProcessor.defined(event.phone)) {
      contactDetailsUpdate['contactDetails.$.phone'] = event.phone;
    }

    try {
      await this.model.updateOne(contactDetailsFilter, { $set: contactDetailsUpdate });
    } catch {
      this.errorCallback(event);
    }
  }

  async processContactDetailsRemoved(event: ContactDetailsRemoved): Promise<void> {
    await this.model.updateOne({ _id: event.legalEntityId }, { $pull: { contactDetails: { _id: event.contactDetailsId } } });
  }
}
