import { SensorEvent } from '../sensor.event';

export class SensorUpdated extends SensorEvent {
  static version = '1';

  readonly legalEntityId: string;
  readonly name: string;
  readonly description: string;
  readonly supplier: string;
  readonly manufacturer: string;
  readonly documentationUrl: string;
  readonly active: boolean;

  constructor(sensorId: string, legalEntityId: string, name: string, description: string, supplier: string,
              manufacturer: string, documentationUrl: string, active: boolean) {
    super(sensorId, SensorUpdated.version);
    this.legalEntityId = legalEntityId;
    this.name = name;
    this.description = description;
    this.supplier = supplier;
    this.manufacturer = manufacturer;
    this.documentationUrl = documentationUrl;
    this.active = active;
  }
}
