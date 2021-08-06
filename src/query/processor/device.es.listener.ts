import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import {
    sensorDeviceEventStreamName,
    sensorDeviceEventType,
    sensorDeviceStreamRootValue,
} from '../../commons/events/sensordevice';
import { SensorDeviceEvent } from '../../commons/events/sensordevice/sensordevice.event';
import { DeviceProcessor } from './device.processor';

@Injectable()
export class DeviceEsListener extends AbstractEsListener {
    constructor(eventStore: EventStorePublisher, checkpointService: CheckpointService, processor: DeviceProcessor) {
        super(
            `backend-${sensorDeviceStreamRootValue}-es`,
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
