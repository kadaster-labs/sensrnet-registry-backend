import { ICommand } from '@nestjs/cqrs';
import Device from '../../interfaces/device.interface';
import Location from '../../interfaces/location.interface';
import { Category } from '../category.model';

export abstract class AbstractDeviceCommand implements ICommand {

    public readonly deviceId: string;
    public readonly name: string;
    public readonly description: string;
    public readonly category: Category;
    public readonly connectivity: string;
    public readonly location: Location;

    constructor(
        public readonly legalEntityId: string,
        device: Device,
    ) {
        this.deviceId = device.deviceId;
        this.name = device.name;
        this.description = device.description;
        this.category = device.category;
        this.connectivity = device.connectivity;
        this.location = device.location;
    }
}
