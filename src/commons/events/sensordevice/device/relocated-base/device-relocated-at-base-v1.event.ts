import { SensorDeviceEvent } from '../../sensordevice.event';

export class DeviceRelocatedAtBaseObject extends SensorDeviceEvent {
    static version = '1';

    readonly name: string;
    readonly description: string;
    readonly location: number[];
    readonly baseObjectId: string;

    constructor(deviceId: string, name: string, description: string, location: number[], baseObjectId: string) {
        super(deviceId, DeviceRelocatedAtBaseObject.version);

        this.name = name;
        this.description = description;
        this.location = location;
        this.baseObjectId = baseObjectId;
    }
}
