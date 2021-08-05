import { ICommand } from '@nestjs/cqrs';

export class AddDataStreamCommand implements ICommand {
    constructor(
        public readonly deviceId: string,
        public readonly sensorId: string,
        public readonly legalEntityId: string,
        public readonly dataStreamId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly unitOfMeasurement: Record<string, any>,
        public readonly observationArea: Record<string, any>,
        public readonly theme: string[],
        public readonly dataQuality: string,
        public readonly isActive: boolean,
        public readonly isPublic: boolean,
        public readonly isOpenData: boolean,
        public readonly containsPersonalInfoData: boolean,
        public readonly isReusable: boolean,
        public readonly documentation: string,
        public readonly dataLink: string,
    ) {}
}
