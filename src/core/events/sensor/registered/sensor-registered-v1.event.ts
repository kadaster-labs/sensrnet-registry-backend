import { SensorEvent } from '../sensor.event';

export class SensorRegistered extends SensorEvent {
  static version = '1';

  readonly legalEntityId: string;
  readonly deviceId: string;
  readonly name: string;
  readonly description: string;
  readonly location: number[];
  readonly supplier: string;
  readonly manufacturer: string;
  readonly documentationUrl: string;
  readonly active: boolean;

  constructor(sensorId: string, legalEntityId: string, deviceId: string,
              name: string, description: string, location: number[], supplier: string,
              manufacturer: string, documentationUrl: string, active: boolean) {
    super(sensorId, SensorRegistered.version);
    this.legalEntityId = legalEntityId;
    this.deviceId = deviceId;
    this.name = name;
    this.description = description;
    this.location = location;
    this.supplier = supplier;
    this.manufacturer = manufacturer;
    this.documentationUrl = documentationUrl;
    this.active = active;
  }
}
