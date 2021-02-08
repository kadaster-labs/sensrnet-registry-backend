import { Injectable } from '@nestjs/common';
import { SensorProcessor } from './sensor.processor';
import { AbstractEsListener } from './abstract.es.listener';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { sensorEventType } from '../../core/events/sensor';
import { SensorEvent } from '../../core/events/sensor/sensor.event';
import { Event as ESEvent } from 'geteventstore-promise';

@Injectable()
export class SensorEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        sensorProcessor: SensorProcessor,
    ) {
        super('backend-sensor-es', '$ce-sensor', eventStore, checkpointService, sensorProcessor);
    }

    parseEvent(eventMessage: ESEvent): SensorEvent {
        return sensorEventType.getEvent(eventMessage) as SensorEvent;
    }
}
