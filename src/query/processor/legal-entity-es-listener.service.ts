import { Injectable } from '@nestjs/common';
import { AbstractEsListener } from './abstract.es.listener';
import { LegalEntityProcessor } from './legal-entity.processor';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { Event as ESEvent } from 'geteventstore-promise';
import { LegalEntityEvent } from '../../core/events/legalentity/legalentity.event';
import { legalEntityEventType } from '../../core/events/legalentity';

@Injectable()
export class LegalEntityEsListener extends AbstractEsListener {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: LegalEntityProcessor,
    ) {
        super('backend-legal-entity-es', '$ce-legalentity', eventStore, checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): LegalEntityEvent {
        return legalEntityEventType.getEvent(eventMessage) as LegalEntityEvent;
    }
}
