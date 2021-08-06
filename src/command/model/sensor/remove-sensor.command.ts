import { ICommand } from '@nestjs/cqrs';

export class RemoveSensorCommand implements ICommand {
    constructor(
        public readonly sensorId: string,
        public readonly legalEntityId: string,
        public readonly deviceId: string,
    ) {}
}
