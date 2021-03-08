import { SensorDeviceEvent } from '../../sensordevice.event';

export class DeviceRegistered extends SensorDeviceEvent {
  static version = '1';

  readonly legalEntityId: string;
  readonly name: string;
  readonly description: string;
  readonly category: String;
  readonly connectivity: string;

  constructor(deviceId: string, legalEntityId: string, name: string, description: string,
    category: String, connectivity: string) {
    super(deviceId, DeviceRegistered.version);

    this.legalEntityId = legalEntityId;
    this.name = name;
    this.description = description;
    this.category = category;
    this.connectivity = connectivity;
  }
}
