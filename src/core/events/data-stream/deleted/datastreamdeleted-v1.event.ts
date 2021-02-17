import { DataStreamEvent } from '../data-stream.event';

export class DatastreamDeleted extends DataStreamEvent {
  static version = '1';

  public readonly sensorId: string;

  constructor(dataStreamId: string, sensorId: string) {
    super(dataStreamId, DatastreamDeleted.version);
    this.sensorId = sensorId;
  }
}
