import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { sensorDeviceEventType, sensorDeviceStreamRootValue } from '../../commons/events/sensordevice';
import { SensorDeviceEvent } from '../../commons/events/sensordevice/sensordevice.event';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
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
