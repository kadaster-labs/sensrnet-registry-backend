import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class DataStreamDeleted extends Event {
  constructor(aggregatedId: string, dataStreamId: string) {
    super(`sensor-${aggregatedId}`, EventType.DataStreamDeleted, {
      sensorId: aggregatedId,
      dataStreamId
    });
  }
}
