import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";
import { LocationBody } from '../../../commands/sensor/models/bodies/location-body';


export class SensorCreated extends Event {
  constructor(aggregatedId: string, nodeId: string, ownerIds: Array<string>, 
    name: string, location: LocationBody, aim: string, description: string, 
    manufacturer: string, active: boolean, observationArea: object, 
    documentationUrl: string, theme: Array<string>, typeName: string, 
    typeDetails: object) {
    super(`sensor-${aggregatedId}`, EventType.SensorCreated, {
      nodeId,
      ownerIds,
      name,
      location,
      aim,
      description,
      manufacturer,
      active,
      observationArea,
      documentationUrl,
      theme,
      typeName,
      typeDetails
    });
  }
}
