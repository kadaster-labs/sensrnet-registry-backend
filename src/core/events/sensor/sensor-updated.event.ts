import {SensorEvent} from './sensor.event';

export class SensorUpdated extends SensorEvent {

  readonly name: string;
  readonly aim: string;
  readonly description: string;
  readonly manufacturer: string;
  readonly observationArea: object;
  readonly documentationUrl: string;
  readonly theme: string[];
  readonly typeName: string;
  readonly typeDetails: object;

  constructor(sensorId: string, name: string, aim: string, description: string, manufacturer: string,
              observationArea: object, documentationUrl: string, theme: string[], typeName: string, typeDetails: object) {
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
