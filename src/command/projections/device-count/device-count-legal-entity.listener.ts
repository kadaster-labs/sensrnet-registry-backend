import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../../commons/event-processing/checkpoint/checkpoint.service';
import { LegalEntityEsListener } from '../../../commons/event-processing/legal-entity.es.listener';
import { EventStorePublisher } from '../../../commons/event-store/event-store.publisher';
import { legalEntityStreamRootValue } from '../../../commons/events/legal-entity';

@Injectable()
export class DeviceCountLegalEntityEsListener extends LegalEntityEsListener {
    constructor(eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(`device-count-${legalEntityStreamRootValue}-es`, eventStore, checkpointService);
    }
}
