import { ICommand } from '@nestjs/cqrs';
import Location from '../../interfaces/location.interface';

export class RelocateDeviceCommand implements ICommand {
    constructor(
        public readonly deviceId: string,
        public readonly legalEntityId: string,
        public readonly location: Location,
    ) {}
}
