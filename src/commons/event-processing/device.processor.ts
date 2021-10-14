import { Event as ESEvent } from 'geteventstore-promise';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { sensorDeviceEventStreamName, sensorDeviceEventType } from '../events/sensordevice';
import { SensorDeviceEvent } from '../events/sensordevice/sensordevice.event';
import { AbstractProcessor } from './abstract.processor';
import { CheckpointService } from './checkpoint/checkpoint.service';

export abstract class DeviceProcessor extends AbstractProcessor {
    constructor(checkpointId: string, eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(checkpointId, `${sensorDeviceEventStreamName}`, eventStore, checkpointService);
    }

    parseEvent(eventMessage: ESEvent): SensorDeviceEvent {
        return sensorDeviceEventType.getEvent(eventMessage) as SensorDeviceEvent;
    }
}
