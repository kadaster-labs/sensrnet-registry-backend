import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class SensorUpdated extends Event {
  constructor(aggregatedId: string, date: string, legalBase: string, typeName: string, typeDetails: object) {
    super(`sensor-${aggregatedId}`, EventType.Updated, {
      date,
      legalBase,
      typeName,
      typeDetails
    });
  }
}
