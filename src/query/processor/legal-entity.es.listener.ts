import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { LegalEntityRemoved, OrganizationRegistered, OrganizationUpdated } from '../../commons/events/legal-entity';
import { PublicContactDetailsAdded } from '../../commons/events/legal-entity/contact-details/added';
import { ContactDetailsRemoved } from '../../commons/events/legal-entity/contact-details/removed';
import { ContactDetailsUpdated } from '../../commons/events/legal-entity/contact-details/updated';
import { LegalEntityEvent } from '../../commons/events/legal-entity/legal-entity.event';
import { Gateway } from '../gateway/gateway';
import { IDevice } from '../model/device.schema';
import { ILegalEntity } from '../model/legal-entity.schema';
import { IRelation } from '../model/relation.schema';
import { AbstractQueryEsListener } from './abstract-query.es.listener';
import { QueryLegalEntityProcessor } from './query-legal-entity.processor';

@Injectable()
export class LegalEntityEsListener extends AbstractQueryEsListener {
    /* This processor processes legal entity events. Events like soft-delete are not handled because they do not need to be processed. */

    constructor(
        eventStore: EventStorePublisher,
        private readonly gateway: Gateway,
        protected readonly processor: QueryLegalEntityProcessor,
        @InjectModel('Device') public deviceModel: Model<IDevice>,
        @InjectModel('LegalEntity') private model: Model<ILegalEntity>,
        @InjectModel('Relation') public relationModel: Model<IRelation>,
    ) {
        super(processor, eventStore, relationModel);
    }

    async process(event: LegalEntityEvent, originSync: boolean): Promise<void> {
        let legalEntity: Record<string, any>;
        let legalEntityIds: string[];

        if (event instanceof OrganizationRegistered) {
            legalEntity = await this.processRegistered(event, originSync);
        } else if (event instanceof OrganizationUpdated) {
            legalEntity = await this.processUpdated(event);
            legalEntityIds = [event.aggregateId];
        } else if (event instanceof LegalEntityRemoved) {
            legalEntity = await this.processDeleted(event);
            legalEntityIds = [event.aggregateId];
        } else if (event instanceof PublicContactDetailsAdded) {
            legalEntity = await this.processPublicContactDetailsAdded(event);
            legalEntityIds = [event.aggregateId];
        } else if (event instanceof ContactDetailsUpdated) {
            legalEntity = await this.processContactDetailsUpdated(event);
            legalEntityIds = [event.aggregateId];
        } else if (event instanceof ContactDetailsRemoved) {
            legalEntity = await this.processContactDetailsRemoved(event);
            legalEntityIds = [event.aggregateId];
        }

        if (legalEntity) {
            this.gateway.emit(event.constructor.name, legalEntityIds, legalEntity.toObject());
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

    async processUpdated(event: OrganizationUpdated): Promise<ILegalEntity> {
        const legalEntityUpdate: Record<string, any> = {};
        if (AbstractQueryEsListener.defined(event.name)) {
            legalEntityUpdate.name = event.name;
        }
        if (AbstractQueryEsListener.defined(event.website)) {
            legalEntityUpdate.website = event.website;
        }

        let legalEntity;
        try {
            legalEntity = await this.model.findOneAndUpdate(
                { _id: event.aggregateId },
                { $set: legalEntityUpdate },
                { new: true },
            );
        } catch {
            this.errorCallback(event);
        }

        return legalEntity;
    }

    async processDeleted(event: LegalEntityRemoved): Promise<ILegalEntity> {
        let legalEntity;
        try {
            this.relationModel.deleteMany({ legalEntityId: event.aggregateId });

            legalEntity = await this.model.findOneAndDelete({ _id: event.aggregateId });
            const legalEntityStreamName = LegalEntityEvent.getStreamName(
                LegalEntityEvent.streamRootValue,
                event.aggregateId,
            );
            await this.eventStore.deleteStream(legalEntityStreamName);
        } catch {
            this.errorCallback(event);
        }

        return legalEntity;
    }

    async processPublicContactDetailsAdded(event: PublicContactDetailsAdded): Promise<ILegalEntity> {
        const contactDetailsData = {
            _id: event.contactDetailsId,
            name: event.name,
            email: event.email,
            phone: event.phone,
            isPublic: true,
        };

        const legalEntityFilter = {
            _id: event.legalEntityId,
            'contactDetails._id': { $ne: event.contactDetailsId },
        };

        let legalEntity;
        try {
            legalEntity = await this.model.findOneAndUpdate(
                legalEntityFilter,
                { $push: { contactDetails: contactDetailsData } },
                { new: true },
            );
        } catch {
            this.errorCallback(event);
        }

        return legalEntity;
    }

    async processContactDetailsUpdated(event: ContactDetailsUpdated): Promise<ILegalEntity> {
        const contactDetailsFilter = {
            _id: event.legalEntityId,
            'contactDetails._id': event.contactDetailsId,
        };

        const contactDetailsUpdate: Record<string, any> = {};
        if (AbstractQueryEsListener.defined(event.name)) {
            contactDetailsUpdate['contactDetails.$.name'] = event.name;
        }
        if (AbstractQueryEsListener.defined(event.email)) {
            contactDetailsUpdate['contactDetails.$.email'] = event.email;
        }
        if (AbstractQueryEsListener.defined(event.phone)) {
            contactDetailsUpdate['contactDetails.$.phone'] = event.phone;
        }

        let legalEntity;
        try {
            legalEntity = await this.model.findOneAndUpdate(
                contactDetailsFilter,
                { $set: contactDetailsUpdate },
                { new: true },
            );
        } catch {
            this.errorCallback(event);
        }

        return legalEntity;
    }

    async processContactDetailsRemoved(event: ContactDetailsRemoved): Promise<ILegalEntity> {
        let legalEntity;
        try {
            legalEntity = await this.model.findOneAndUpdate(
                { _id: event.legalEntityId },
                { $pull: { contactDetails: { _id: event.contactDetailsId } } },
                { new: true },
            );
        } catch {
            this.errorCallback(event);
        }

        return legalEntity;
    }
}
