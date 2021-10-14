import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { LegalEntityProcessor } from '../../commons/event-processing/legal-entity.processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import {
    LegalEntityRemoved,
    legalEntityStreamRootValue,
    OrganizationRegistered,
    OrganizationUpdated,
} from '../../commons/events/legal-entity';
import {
    ContactDetailsRemoved,
    ContactDetailsUpdated,
    PublicContactDetailsAdded,
} from '../../commons/events/legal-entity/contact-details';
import { LegalEntityEvent } from '../../commons/events/legal-entity/legal-entity.event';
import { Gateway } from '../gateway/gateway';
import { LegalEntityEsListener } from './legal-entity.es.listener';

@Injectable()
export class QueryLegalEntityProcessor extends LegalEntityProcessor {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly gateway: Gateway,
        private readonly legalEntityListener: LegalEntityEsListener,
    ) {
        super(`backend-${legalEntityStreamRootValue}-es`, eventStore, checkpointService);
    }

    async process(event: LegalEntityEvent, originSync: boolean): Promise<void> {
        let legalEntity: Record<string, any>;
        let legalEntityIds: string[];

        if (event instanceof OrganizationRegistered) {
            legalEntity = await this.legalEntityListener.processRegistered(event, originSync);
        } else if (event instanceof OrganizationUpdated) {
            legalEntity = await this.legalEntityListener.processUpdated(event);
            legalEntityIds = [event.aggregateId];
        } else if (event instanceof LegalEntityRemoved) {
            legalEntity = await this.legalEntityListener.processDeleted(event);
            legalEntityIds = [event.aggregateId];
        } else if (event instanceof PublicContactDetailsAdded) {
            legalEntity = await this.legalEntityListener.processPublicContactDetailsAdded(event);
            legalEntityIds = [event.aggregateId];
        } else if (event instanceof ContactDetailsUpdated) {
            legalEntity = await this.legalEntityListener.processContactDetailsUpdated(event);
            legalEntityIds = [event.aggregateId];
        } else if (event instanceof ContactDetailsRemoved) {
            legalEntity = await this.legalEntityListener.processContactDetailsRemoved(event);
            legalEntityIds = [event.aggregateId];
        }

        if (legalEntity) {
            this.gateway.emit(event.constructor.name, legalEntityIds, legalEntity.toObject());
        }
    }
}
