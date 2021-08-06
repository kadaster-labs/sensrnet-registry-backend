import { SensorDeviceEvent } from '../../sensordevice.event';

export class DeviceRemoved extends SensorDeviceEvent {
    static version = '1';

    readonly legalEntityId: string;

    constructor(deviceId: string, legalEntityId: string) {
        super(deviceId, DeviceRemoved.version);
        this.legalEntityId = legalEntityId;
    }
}
