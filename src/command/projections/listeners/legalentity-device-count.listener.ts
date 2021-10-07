import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { AbstractEsListener } from '../../../commons/event-processing/abstract.es.listener';
import { CheckpointService } from '../../../commons/event-processing/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../../commons/event-store/event-store.publisher';
import { sensorDeviceEventStreamName, sensorDeviceEventType } from '../../../commons/events/sensordevice';
import { SensorDeviceEvent } from '../../../commons/events/sensordevice/sensordevice.event';
import { LegalentityDeviceCountProjection } from '../legalentity-device-count.projection';

@Injectable()
export class LegalentityDeviceCountListener extends AbstractEsListener {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: LegalentityDeviceCountProjection,
    ) {
        super(
            `device-by-legalentity-projection`,
            `${sensorDeviceEventStreamName}`,
            eventStore,
            checkpointService,
            processor,
        );
    }

    parseEvent(eventMessage: ESEvent): SensorDeviceEvent {
        return sensorDeviceEventType.getEvent(eventMessage) as SensorDeviceEvent;
    }
}
