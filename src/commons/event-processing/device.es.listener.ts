import { Event as ESEvent } from 'geteventstore-promise';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { sensorDeviceEventStreamName, sensorDeviceEventType } from '../events/sensordevice';
import { SensorDeviceEvent } from '../events/sensordevice/sensordevice.event';
import { AbstractEsListener } from './abstract.es.listener';
import { CheckpointService } from './checkpoint/checkpoint.service';

export class DeviceEsListener extends AbstractEsListener {
    constructor(checkpointId: string, eventStore: EventStorePublisher, checkpointService: CheckpointService) {
        super(checkpointId, `${sensorDeviceEventStreamName}`, eventStore, checkpointService);
    }

    parseEvent(eventMessage: ESEvent): SensorDeviceEvent {
        return sensorDeviceEventType.getEvent(eventMessage) as SensorDeviceEvent;
    }

    async onModuleInit(): Promise<void> {
        await this.openSubscription();
    }
}
