import Device from '../../interfaces/device.interface';
import { AbstractDeviceCommand } from './abstract-device.command';

export class RegisterDeviceCommand extends AbstractDeviceCommand {

    constructor(
        public readonly legalEntityId: string,
        device: Device,
    ) {
        super(legalEntityId, device);
    }

}
