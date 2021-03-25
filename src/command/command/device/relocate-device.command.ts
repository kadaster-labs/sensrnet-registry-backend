import { ICommand } from '@nestjs/cqrs';
import { UpdateLocationBody } from '../../controller/model/location/update-location.body';

export class RelocateDeviceCommand implements ICommand {
    constructor(
        public readonly deviceId: string,
        public readonly legalEntityId: string,
        public readonly location: UpdateLocationBody,
    ) { }
}
