import { SensorDeviceEvent } from '../../sensordevice.event';

export class DatastreamRemoved extends SensorDeviceEvent {
  static version = '1';

  public readonly sensorId: string;
  public readonly legalEntityId: string;
  public readonly dataStreamId: string;

  constructor(sensorDeviceId: string, sensorId: string, legalEntityId: string, dataStreamId: string) {
    super(sensorDeviceId, DatastreamRemoved.version);
    this.sensorId = sensorId;
    this.legalEntityId = legalEntityId;
    this.dataStreamId = dataStreamId;
  }
}
