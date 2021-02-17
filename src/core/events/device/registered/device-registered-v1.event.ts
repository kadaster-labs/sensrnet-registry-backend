import { DeviceEvent } from '../device.event';

export class DeviceRegistered extends DeviceEvent {
  static version = '1';

  readonly legalEntityId: string;
  readonly description: string;
  readonly connectivity: string;
  readonly location: number[];

  constructor(deviceId: string, legalEntityId: string, description: string, connectivity: string, location: number[]) {
    super(deviceId, DeviceRegistered.version);
    this.legalEntityId = legalEntityId;
    this.description = description;
    this.connectivity = connectivity;
    this.location = location;
  }
}
