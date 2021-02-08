import {SensorEvent} from '../sensor.event';

export class DatastreamDeleted extends SensorEvent {
  static version = '1';

  public readonly dataStreamId: string;

  constructor(sensorId: string, dataStreamId: string) {
    super(sensorId, DatastreamDeleted.version);
    this.dataStreamId = dataStreamId;
  }
}
