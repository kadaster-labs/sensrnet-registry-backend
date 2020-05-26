import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class SensorUpdated extends Event {
  constructor(aggregatedId: string, name: string, aim: string, description: string, manufacturer: string, 
    observationArea: object, documentationUrl: string, category: string, theme: string,
    typeName: string, typeDetails: object) {
    super(`sensor-${aggregatedId}`, EventType.Updated, {
      name,
      aim,
      description,
      manufacturer,
      observationArea,
      documentationUrl,
      category,
      theme,
      typeName,
      typeDetails
    });
  }
}
