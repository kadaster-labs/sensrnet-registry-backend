import { SensorDeviceEvent } from '../../sensordevice.event';

export class DeviceRelocated extends SensorDeviceEvent {
    static version = '1';

    readonly name: string;
    readonly description: string;
    readonly location: number[];

    constructor(deviceId: string, name: string, description: string, location: number[]) {
        super(deviceId, DeviceRelocated.version);

        this.name = name;
        this.description = description;
        this.location = location;
    }
}
