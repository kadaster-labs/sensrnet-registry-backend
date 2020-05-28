import { Event } from "../../../event-store/event";

export class DataStreamDeleted extends Event {
  constructor(aggregatedId: string, dataStreamId: string) {
    super(`sensor-${aggregatedId}`, DataStreamDeleted.name, {
      sensorId: aggregatedId,
      dataStreamId
    });
  }
}
