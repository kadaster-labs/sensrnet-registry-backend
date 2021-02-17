import { ChangeDataStreamEvent } from '../change.data-stream.event';
import { RegisterObservationBody } from '../../../../command/controller/model/observation/register-observation.body';

export class DatastreamAdded extends ChangeDataStreamEvent {

    readonly legalEntityId: string;

    constructor(dataStreamId: string, legalEntityId: string, sensorId: string, name: string, description: string, unitOfMeasurement: string,
                isPublic: boolean, isOpenData: boolean, isReusable: boolean, containsPersonalInfoData: boolean,
                documentationUrl: string, dataLink: string, dataFrequency: number, dataQuality: number, theme: string[],
                observation: RegisterObservationBody) {
        super(dataStreamId, sensorId, name, description, unitOfMeasurement, isPublic, isOpenData, isReusable,
            containsPersonalInfoData, documentationUrl, dataLink, dataFrequency, dataQuality, theme, observation);
        this.legalEntityId = legalEntityId;
    }
}
