import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { sensorDeviceEventType, sensorDeviceStreamRootValue } from '../../core/events/sensordevice';
import { SensorDeviceEvent } from '../../core/events/sensordevice/sensordevice.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { AbstractEsListener } from './abstract.es.listener';
import { DeviceProcessor } from './device.processor';

@Injectable()
export class DeviceEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: DeviceProcessor,
    ) {
        super(`backend-${sensorDeviceStreamRootValue}-es`, `$ce-${sensorDeviceStreamRootValue}`, eventStore,
            checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): SensorDeviceEvent {
        return sensorDeviceEventType.getEvent(eventMessage) as SensorDeviceEvent;
    }

}
