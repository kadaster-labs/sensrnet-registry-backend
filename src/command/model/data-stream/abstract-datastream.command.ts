import { ICommand } from "@nestjs/cqrs";
import Datastream from "../../interfaces/datastream.interface";

export abstract class AbstractDatastreamCommand implements ICommand {

    public readonly datastreamId: string;
    public readonly name: string;
    public readonly description: string;
    public readonly unitOfMeasurement: Record<string, any>;
    public readonly observationArea: Record<string, any>;
    public readonly theme: string[];
    public readonly dataQuality: string;
    public readonly isActive: boolean;
    public readonly isPublic: boolean;
    public readonly isOpenData: boolean;
    public readonly containsPersonalInfoData: boolean;
    public readonly isReusable: boolean;
    public readonly documentation: string;
    public readonly dataLink: string;

    constructor(
        public readonly deviceId: string,
        public readonly sensorId: string,
        public readonly legalEntityId: string,
        datastream: Datastream,
    ) {
        this.datastreamId = datastream.datastreamId;
        this.name = datastream.name;
        this.description = datastream.description;
        this.unitOfMeasurement = datastream.unitOfMeasurement;
        this.observationArea = datastream.observedArea;
        this.theme = datastream.theme;
        this.dataQuality = datastream.dataQuality;
        this.isActive = datastream.isActive;
        this.isPublic = datastream.isPublic;
        this.isOpenData = datastream.isOpenData;
        this.containsPersonalInfoData = datastream.containsPersonalInfoData;
        this.isReusable = datastream.isReusable;
        this.documentation = datastream.documentation;
        this.dataLink = datastream.dataLink;
    }

}