import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { DeviceEsListener } from '../../commons/event-processing/device.es.listener';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { sensorDeviceStreamRootValue } from '../../commons/events/sensordevice';

@Injectable()
export class QueryDeviceEsListener extends DeviceEsListener {
    constructor(eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(`backend-${sensorDeviceStreamRootValue}-es`, eventStore, checkpointService);
    }
}
