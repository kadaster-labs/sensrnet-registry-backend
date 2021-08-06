import { SensorDeviceEvent } from '../../sensordevice.event';

export class DatastreamRemoved extends SensorDeviceEvent {
  static version = '1';

  public readonly sensorId: string;
  public readonly legalEntityId: string;
  public readonly datastreamId: string;

  constructor(sensorDeviceId: string, sensorId: string, legalEntityId: string, datastreamId: string) {
    super(sensorDeviceId, DatastreamRemoved.version);
    this.sensorId = sensorId;
    this.legalEntityId = legalEntityId;
    this.datastreamId = datastreamId;
  }
}
