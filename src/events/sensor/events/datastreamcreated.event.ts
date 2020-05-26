import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class DataStreamCreated extends Event {
  constructor(aggregatedId: string, dataStreamId: string, name: string, description: string, unitOfMeasurement: string, 
    isPublic: boolean, isOpenData: boolean, isReusable: boolean, documentationUrl: string, dataLink: string,
    dataFrequency: number, dataQuality: number) {
    super(`sensor-${aggregatedId}`, EventType.DataStreamCreated, {
      dataStreamId,
      name,
      description,
      unitOfMeasurement,
      isPublic,
      isOpenData,
      isReusable,
      documentationUrl,
      dataLink,
      dataFrequency,
      dataQuality
    });
  }
}
