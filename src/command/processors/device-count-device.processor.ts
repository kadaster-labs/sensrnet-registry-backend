import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { DeviceProcessor } from '../../commons/event-processing/device.processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { sensorDeviceStreamRootValue } from '../../commons/events/sensordevice';

@Injectable()
export class DeviceCountDeviceProcessor extends DeviceProcessor {
    constructor(eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(`device-count-${sensorDeviceStreamRootValue}-es`, eventStore, checkpointService);
    }
}
