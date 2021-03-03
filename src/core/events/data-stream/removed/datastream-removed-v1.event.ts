import { DeviceEvent } from '../../device/device.event';

export class DatastreamRemoved extends DeviceEvent {
  static version = '1';

  public readonly deviceId: string;
  public readonly sensorId: string;
  public readonly legalEntityId: string;
  public readonly dataStreamId: string;

  constructor(deviceId: string, sensorId: string, legalEntityId: string, dataStreamId: string) {
    super(deviceId, DatastreamRemoved.version);
    this.sensorId = sensorId;
    this.legalEntityId = legalEntityId;
    this.dataStreamId = dataStreamId;
  }
}
