import { SensorEvent } from '../../sensor.event';

export class SensorRegistered extends SensorEvent {
  static version = '2';

  readonly organizationId: string;
  readonly name: string;
  readonly location: number[];
  readonly baseObjectId: string;
  readonly aim: string;
  readonly description: string;
  readonly manufacturer: string;
  readonly active: boolean;
  readonly observationArea: Record<string, any>;
  readonly documentationUrl: string;
  readonly theme: string[];
  readonly category: string;
  readonly typeName: string;
  readonly typeDetails: Record<string, any>;

  constructor(sensorId: string, organizationId: string, name: string, location: number[], baseObjectId: string,
              aim: string, description: string, manufacturer: string, active: boolean,
              observationArea: Record<string, any>, documentationUrl: string, theme: string[], category: string,
              typeName: string, typeDetails: Record<string, any>) {
    super(sensorId, SensorRegistered.version);
    this.organizationId = organizationId;
    this.name = name;
    this.location = location;
    this.baseObjectId = baseObjectId;
    this.aim = aim;
    this.description = description;
    this.manufacturer = manufacturer;
    this.active = active;
    this.observationArea = observationArea;
    this.documentationUrl = documentationUrl;
    this.theme = theme;
    this.category = category;
    this.typeName = typeName;
    this.typeDetails = typeDetails;
  }
}
