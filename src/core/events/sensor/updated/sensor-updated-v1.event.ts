import { SensorEvent } from '../sensor.event';

export class SensorUpdated extends SensorEvent {
  static version = '1';

  readonly name: string;
  readonly aim: string;
  readonly description: string;
  readonly manufacturer: string;
  readonly observationArea: Record<string, any>;
  readonly documentationUrl: string;
  readonly theme: string[];
  readonly category: string;
  readonly typeName: string;
  readonly typeDetails: Record<string, any>;

  constructor(sensorId: string, name: string, aim: string, description: string, manufacturer: string,
              observationArea: Record<string, any>, documentationUrl: string, theme: string[], category: string,
              typeName: string, typeDetails: Record<string, any>) {
    super(sensorId, SensorUpdated.version);
    this.name = name;
    this.aim = aim;
    this.description = description;
    this.manufacturer = manufacturer;
    this.observationArea = observationArea;
    this.documentationUrl = documentationUrl;
    this.theme = theme;
    this.category = category;
    this.typeName = typeName;
    this.typeDetails = typeDetails;
  }
}
