import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { AbstractEsListener } from './abstract.es.listener';
import { DeviceProcessor } from './device.processor';
import { sensorDeviceEventType } from '../../core/events/sensordevice';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { SensorDeviceEvent } from '../../core/events/sensordevice/sensordevice.event';

@Injectable()
export class DeviceEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: DeviceProcessor,
    ) {
        super('backend-device-es', '$ce-device', eventStore, checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): SensorDeviceEvent {
        return sensorDeviceEventType.getEvent(eventMessage) as SensorDeviceEvent;
    }
}
