import { ICommand } from '@nestjs/cqrs';
import { UpdateObservationBody } from '../../controller/model/observation/update-observation.body';

export class UpdateDataStreamCommand implements ICommand {
    constructor(
        public readonly sensorId: string,
        public readonly legalEntityId: string,
        public readonly dataStreamId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly unitOfMeasurement: string,
        public readonly isPublic: boolean,
        public readonly isOpenData: boolean,
        public readonly isReusable: boolean,
        public readonly containsPersonalInfoData: boolean,
        public readonly documentationUrl: string,
        public readonly dataLink: string,
        public readonly dataFrequency: number,
        public readonly dataQuality: number,
        public readonly theme: string[],
        public readonly observation: UpdateObservationBody,
    ) {}
}
