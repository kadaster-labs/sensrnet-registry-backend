import { SensorDeviceEvent } from '../../sensordevice.event';

export class DeviceUpdated extends SensorDeviceEvent {
    static version = '1';

    readonly legalEntityId: string;
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly connectivity: string;

    constructor(
        deviceId: string,
        legalEntityId: string,
        name: string,
        description: string,
        category: string,
        connectivity: string,
    ) {
        super(deviceId, DeviceUpdated.version);
        this.legalEntityId = legalEntityId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.connectivity = connectivity;
    }
}
