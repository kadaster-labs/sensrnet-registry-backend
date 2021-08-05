import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { legalEntityEventType, legalEntityStreamRootValue } from '../../commons/events/legal-entity';
import { LegalEntityEvent } from '../../commons/events/legal-entity/legal-entity.event';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { LegalEntityProcessor } from './legal-entity.processor';

@Injectable()
export class LegalEntityEsListener extends AbstractEsListener {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: LegalEntityProcessor,
    ) {
        super(`backend-${legalEntityStreamRootValue}-es`, `$ce-${legalEntityStreamRootValue}`, eventStore,
            checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): LegalEntityEvent {
        return legalEntityEventType.getEvent(eventMessage) as LegalEntityEvent;
    }

}
