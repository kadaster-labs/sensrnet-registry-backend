import { DataStreamEvent } from './data-stream.event';
import { RegisterObservationBody } from '../../../command/controller/model/observation/register-observation.body';

export abstract class ChangeDataStreamEvent extends DataStreamEvent {
  static version = '1';

  public readonly sensorId: string;
  public readonly name: string;
  public readonly description: string;
  public readonly unitOfMeasurement: string;
  public readonly isPublic: boolean;
  public readonly isOpenData: boolean;
  public readonly isReusable: boolean;
  public readonly containsPersonalInfoData: boolean;
  public readonly documentationUrl: string;
  public readonly dataLink: string;
  public readonly dataFrequency: number;
  public readonly dataQuality: number;
  public readonly theme: string[];
  public readonly observation: RegisterObservationBody;

  constructor(dataStreamId: string, sensorId: string, name: string, description: string, unitOfMeasurement: string,
              isPublic: boolean, isOpenData: boolean, isReusable: boolean, containsPersonalInfoData: boolean,
              documentationUrl: string, dataLink: string, dataFrequency: number, dataQuality: number, theme: string[],
              observation: RegisterObservationBody) {
    super(dataStreamId, ChangeDataStreamEvent.version);
    this.sensorId = sensorId;
    this.name = name;
    this.description = description;
    this.unitOfMeasurement = unitOfMeasurement;
    this.isPublic = isPublic;
    this.isOpenData = isOpenData;
    this.isReusable = isReusable;
    this.containsPersonalInfoData = containsPersonalInfoData;
    this.documentationUrl = documentationUrl;
    this.dataLink = dataLink;
    this.dataFrequency = dataFrequency;
    this.dataQuality = dataQuality;
    this.theme = theme;
    this.observation = observation;
  }
}
