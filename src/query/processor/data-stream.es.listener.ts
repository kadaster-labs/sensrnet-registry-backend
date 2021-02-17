import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { AbstractEsListener } from './abstract.es.listener';
import { DataStreamProcessor } from './data-stream.processor';
import { dataStreamEventType } from '../../core/events/data-stream';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { DataStreamEvent } from '../../core/events/data-stream/data-stream.event';

@Injectable()
export class DataStreamEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: DataStreamProcessor,
    ) {
        super('backend-datastream-es', '$ce-datastream', eventStore, checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): DataStreamEvent {
        return dataStreamEventType.getEvent(eventMessage) as DataStreamEvent;
    }
}
