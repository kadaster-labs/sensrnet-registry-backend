import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { LegalEntityProcessor } from '../../commons/event-processing/legal-entity.processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { LegalEntityRemoved, legalEntityStreamRootValue } from '../../commons/events/legal-entity';
import { LegalEntityEvent } from '../../commons/events/legal-entity/legal-entity.event';
import { DeviceCountEsListener } from './device-count.es.listener';

@Injectable()
export class DeviceCountLegalEntityProcessor extends LegalEntityProcessor {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly listener: DeviceCountEsListener,
    ) {
        super(`device-count-${legalEntityStreamRootValue}-es`, eventStore, checkpointService);
    }

    async process(event: LegalEntityEvent, originSync: boolean): Promise<void> {
        if (!originSync) {
            if (event instanceof LegalEntityRemoved) {
                await this.listener.processLegalEntityRemoved(event);
            }
        }
    }
}
