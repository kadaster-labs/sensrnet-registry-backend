import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { LegalEntityProcessor } from '../../commons/event-processing/legal-entity.processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { legalEntityStreamRootValue } from '../../commons/events/legal-entity';

@Injectable()
export class GrantRightsLegalEntityProcessor extends LegalEntityProcessor {
    constructor(eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(`grant-rights-${legalEntityStreamRootValue}-es`, eventStore, checkpointService);
    }
}
