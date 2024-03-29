import { SensorDeviceEvent } from '../../sensordevice.event';

export class DatastreamUpdated extends SensorDeviceEvent {
    static version = '1';

    readonly sensorId: string;
    readonly legalEntityId: string;
    readonly datastreamId: string;
    readonly name: string;
    readonly description: string;
    readonly unitOfMeasurement: Record<string, any>;
    readonly observationArea: Record<string, any>;
    readonly theme: string[];
    readonly dataQuality: string;
    readonly isActive: boolean;
    readonly isPublic: boolean;
    readonly isOpenData: boolean;
    readonly containsPersonalInfoData: boolean;
    readonly isReusable: boolean;
    readonly documentation: string;
    readonly dataLink: string;

    constructor(
        sensorDeviceId: string,
        sensorId: string,
        legalEntityId: string,
        datastreamId: string,
        name: string,
        description: string,
        unitOfMeasurement: Record<string, any>,
        observationArea: Record<string, any>,
        theme: string[],
        dataQuality: string,
        isActive: boolean,
        isPublic: boolean,
        isOpenData: boolean,
        containsPersonalInfoData: boolean,
        isReusable: boolean,
        documentation: string,
        dataLink: string,
    ) {
        super(sensorDeviceId, DatastreamUpdated.version);
        this.sensorId = sensorId;
        this.legalEntityId = legalEntityId;
        this.datastreamId = datastreamId;
        this.name = name;
        this.description = description;
        this.unitOfMeasurement = unitOfMeasurement;
        this.observationArea = observationArea;
        this.theme = theme;
        this.dataQuality = dataQuality;
        this.isActive = isActive;
        this.isPublic = isPublic;
        this.isOpenData = isOpenData;
        this.containsPersonalInfoData = containsPersonalInfoData;
        this.isReusable = isReusable;
        this.documentation = documentation;
        this.dataLink = dataLink;
    }
}
