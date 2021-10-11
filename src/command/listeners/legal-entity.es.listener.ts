import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Event as ESEvent } from 'geteventstore-promise';
import { Connection } from 'mongoose';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import {
    legalEntityEventStreamName,
    legalEntityEventType,
    legalEntityStreamRootValue,
} from '../../commons/events/legal-entity';
import { LegalEntityEvent } from '../../commons/events/legal-entity/legal-entity.event';

@Injectable()
export class LegalEntityEsListener extends AbstractEsListener {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        @InjectConnection() protected readonly connection: Connection,
    ) {
        super(
            `command-${legalEntityStreamRootValue}-es`,
            `${legalEntityEventStreamName}`,
            eventStore,
            checkpointService,
            connection,
        );
    }

    parseEvent(eventMessage: ESEvent): LegalEntityEvent {
        return legalEntityEventType.getEvent(eventMessage) as LegalEntityEvent;
    }
}
