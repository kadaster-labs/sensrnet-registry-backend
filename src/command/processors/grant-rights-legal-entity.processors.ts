import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { LegalEntityProcessor } from '../../commons/event-processing/legal-entity.processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { legalEntityStreamRootValue, OrganizationRegistered } from '../../commons/events/legal-entity';
import { LegalEntityEvent } from '../../commons/events/legal-entity/legal-entity.event';
import { GrantRightsLegalEntityEsListener } from './grant-rights-legal-entity.es.listener';

@Injectable()
export class GrantRightsLegalEntityProcessor extends LegalEntityProcessor {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly listener: GrantRightsLegalEntityEsListener,
    ) {
        super(`grant-rights-${legalEntityStreamRootValue}-es`, eventStore, checkpointService);
    }

    async process(event: LegalEntityEvent, originSync: boolean): Promise<void> {
        if (event instanceof OrganizationRegistered) {
            await this.listener.processRegistered(event, originSync);
        }
    }
}
