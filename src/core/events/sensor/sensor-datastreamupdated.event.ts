import {SensorEvent} from './sensor.event';

export class DatastreamUpdated extends SensorEvent {

  public readonly dataStreamId: string;
  public readonly name: string;
  public readonly reason: string;
  public readonly description: string;
  public readonly observedProperty: string;
  public readonly unitOfMeasurement: string;
  public readonly isPublic: boolean;
  public readonly isOpenData: boolean;
  public readonly isReusable: boolean;
  public readonly documentationUrl: string;
  public readonly dataLink: string;
  public readonly dataFrequency: number;
  public readonly dataQuality: number;

  constructor(sensorId: string, dataStreamId: string, name: string, reason: string, description: string,
              observedProperty: string, unitOfMeasurement: string, isPublic: boolean, isOpenData: boolean,
              isReusable: boolean, documentationUrl: string, dataLink: string,
              dataFrequency: number, dataQuality: number) {
    super(sensorId);
    this.dataStreamId = dataStreamId;
    this.name = name;
    this.reason = reason;
    this.description = description;
    this.observedProperty = observedProperty;
    this.unitOfMeasurement = unitOfMeasurement;
    this.isPublic = isPublic;
    this.isOpenData = isOpenData;
    this.isReusable = isReusable;
    this.documentationUrl = documentationUrl;
    this.dataLink = dataLink;
    this.dataFrequency = dataFrequency;
    this.dataQuality = dataQuality;
  }
}
