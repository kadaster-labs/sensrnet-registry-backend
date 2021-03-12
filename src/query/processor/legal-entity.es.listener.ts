import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { legalEntityEventType, legalEntityStreamRootValue } from '../../core/events/legal-entity';
import { LegalEntityEvent } from '../../core/events/legal-entity/legal-entity.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { AbstractEsListener } from './abstract.es.listener';
import { LegalEntityProcessor } from './legal-entity.processor';

@Injectable()
export class LegalEntityEsListener extends AbstractEsListener {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: LegalEntityProcessor,
    ) {
        super(`backend-${legalEntityStreamRootValue}-es`, `$ce-${legalEntityStreamRootValue}`, eventStore, checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): LegalEntityEvent {
        return legalEntityEventType.getEvent(eventMessage) as LegalEntityEvent;
    }

}
