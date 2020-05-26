import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class DataStreamDeleted extends Event {
  constructor(aggregatedId: string, sensorId: string, dataStreamId: string) {
    super(`sensor-${aggregatedId}`, EventType.DataStreamDeleted, {
      sensorId,
      dataStreamId
    });
  }
}
