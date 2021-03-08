import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractProcessor } from './abstract.processor';
import { ILegalEntity } from '../model/legal-entity.model';
import { LegalEntityGateway } from '../gateway/legal-entity.gateway';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { LegalEntityEvent } from '../../core/events/legal-entity/legal-entity.event';
import { LegalEntityRemoved, OrganizationRegistered, OrganizationUpdated } from '../../core/events/legal-entity';
import { IRelation, RelationVariant } from '../model/relation.model';

@Injectable()
export class LegalEntityProcessor extends AbstractProcessor {
  /* This processor processes legal entity events. Events like soft-delete are not handled because they do not need to be processed. */

  constructor(
      eventStore: EventStorePublisher,
      private readonly legalEntityGateway: LegalEntityGateway,
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
    }

    if (result) {
      this.legalEntityGateway.emit(event.constructor.name, result);
    }
  }

  async processRegistered(event: OrganizationRegistered, originSync: boolean): Promise<ILegalEntity> {
    const legalEntityData: Record<string, any> = {
      _id: event.aggregateId,
      website: event.website,
      originSync: !!originSync,
      // TODO implement contact details
      // contactDetails: [event.contactDetails],
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
    if (AbstractProcessor.defined(event.website)) { legalEntityUpdate.website = event.website; }
    // if (AbstractProcessor.defined(event.contactDetails)) {
    //   legalEntityUpdate.contactDetails = {};
    //   for (const [k, v] of Object.entries(event.contactDetails)) {
    //     if (AbstractProcessor.defined(v)) {
    //       legalEntityUpdate.contactDetails[k] = v;
    //     }
    //   }
    // }

    this.model.updateOne({_id: event.aggregateId}, legalEntityUpdate, {}, (err) => {
      if (err) {
        this.logger.error('Error while updating legal entity projection.');
      }
    });
  }

  async processDeleted(event: LegalEntityRemoved): Promise<void> {
    await this.model.deleteOne({_id: event.aggregateId});

    const legalEntityStreamName = LegalEntityEvent.getStreamName(LegalEntityEvent.streamRootValue, event.aggregateId);
    await this.eventStore.deleteStream(legalEntityStreamName);
  }
}
