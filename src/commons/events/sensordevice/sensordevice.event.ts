import { Event } from '../../event-store/event';
import { sensorDeviceStreamRootValue } from './sensordevice.stream';

export abstract class SensorDeviceEvent extends Event {
    static streamRootValue = sensorDeviceStreamRootValue;

    readonly deviceId: string;

    protected constructor(sensorDeviceId: string, version: string) {
        super(sensorDeviceId, version);

        this.deviceId = sensorDeviceId;
    }

    streamRoot(): string {
        return SensorDeviceEvent.streamRootValue;
    }
}
