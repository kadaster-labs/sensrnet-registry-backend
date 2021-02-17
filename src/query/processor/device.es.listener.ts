import { Injectable } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { AbstractEsListener } from './abstract.es.listener';
import { DeviceProcessor } from './device.processor';
import { deviceEventType } from '../../core/events/device';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { DeviceEvent } from '../../core/events/device/device.event';

@Injectable()
export class DeviceEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        processor: DeviceProcessor,
    ) {
        super('backend-device-es', '$ce-device', eventStore, checkpointService, processor);
    }

    parseEvent(eventMessage: ESEvent): DeviceEvent {
        return deviceEventType.getEvent(eventMessage) as DeviceEvent;
    }
}
