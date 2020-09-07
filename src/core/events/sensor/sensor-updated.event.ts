import {SensorEvent} from './sensor.event';

export class SensorUpdated extends SensorEvent {

  readonly name: string;
  readonly aim: string;
  readonly description: string;
  readonly manufacturer: string;
  readonly observationArea: Record<string, any>;
  readonly documentationUrl: string;
  readonly theme: string[];
  readonly typeName: string;
  readonly typeDetails: Record<string, any>;

  constructor(sensorId: string, name: string, aim: string, description: string, manufacturer: string,
              observationArea: Record<string, any>, documentationUrl: string, theme: string[], typeName: string,
              typeDetails: Record<string, any>) {
    super(sensorId);
    this.name = name;
    this.aim = aim;
    this.description = description;
    this.manufacturer = manufacturer;
    this.observationArea = observationArea;
    this.documentationUrl = documentationUrl;
    this.theme = theme;
    this.typeName = typeName;
    this.typeDetails = typeDetails;
  }
}
