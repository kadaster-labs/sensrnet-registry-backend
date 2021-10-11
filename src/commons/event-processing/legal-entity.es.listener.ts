import { Event as ESEvent } from 'geteventstore-promise';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { legalEntityEventStreamName, legalEntityEventType } from '../events/legal-entity';
import { LegalEntityEvent } from '../events/legal-entity/legal-entity.event';
import { AbstractEsListener } from './abstract.es.listener';
import { CheckpointService } from './checkpoint/checkpoint.service';

export class LegalEntityEsListener extends AbstractEsListener {
    constructor(checkpointId: string, eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(checkpointId, `${legalEntityEventStreamName}`, eventStore, checkpointService);
    }

    parseEvent(eventMessage: ESEvent): LegalEntityEvent {
        return legalEntityEventType.getEvent(eventMessage) as LegalEntityEvent;
    }
}
