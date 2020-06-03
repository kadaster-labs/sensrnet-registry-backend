import { Event } from '../../../event-store/event';

export class DatastreamDeleted extends Event {
  constructor(aggregatedId: string, dataStreamId: string) {
    super(`sensor-${aggregatedId}`, DatastreamDeleted.name, {
      sensorId: aggregatedId,
      dataStreamId,
    });
  }
}
