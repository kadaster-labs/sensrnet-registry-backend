import {SensorEvent} from './sensor.event';

export class DatastreamDeleted extends SensorEvent {

  readonly dataStreamId: string;

  constructor(sensorId: string, dataStreamId: string) {
    super(sensorId);
    this.dataStreamId = dataStreamId;
  }
}
