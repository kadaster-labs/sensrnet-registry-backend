import { SensorDeviceEvent } from '../../sensordevice.event';

export class DeviceLocated extends SensorDeviceEvent {
    static version = '1';

    readonly name: string;
    readonly description: string;
    readonly location: number[];

    constructor(deviceId: string, name: string, description: string, location: number[]) {
        super(deviceId, DeviceLocated.version);

        this.name = name;
        this.description = description;
        this.location = location;
    }

}  