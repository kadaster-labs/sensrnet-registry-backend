import { SensorDeviceEvent } from '../../sensordevice.event';

export class SensorAdded extends SensorDeviceEvent {
  static version = '1';

  readonly sensorId: string;
  readonly legalEntityId: string;
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly manufacturer: string;
  readonly supplier: string;
  readonly documentation: string;

  constructor(deviceId: string, sensorId: string, legalEntityId: string, name: string, description: string,
    type: string, manufacturer: string, supplier: string, documentation: string) {
    super(deviceId, SensorAdded.version);

    this.sensorId = sensorId;
    this.legalEntityId = legalEntityId;
    this.name = name;
    this.description = description;
    this.type = type;
    this.manufacturer = manufacturer;
    this.supplier = supplier;
    this.documentation = documentation;
  }
}
