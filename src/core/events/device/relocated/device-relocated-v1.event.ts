import { DeviceEvent } from '../device.event';

export class DeviceRelocated extends DeviceEvent {
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