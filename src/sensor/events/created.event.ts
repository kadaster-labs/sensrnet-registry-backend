import { EventType } from "./event-type";
import { Event } from "../../event-store/event";
import { LocationBody } from '../models/bodies/location-body';


export class SensorCreated extends Event {
  constructor(aggregatedId: string, date: string, nodeId: string, ownerIds: Array<string>, 
    location: LocationBody, legalBase: string, active: boolean, typeName: string, typeDetails: object) {
    super(`sensor-${aggregatedId}`, EventType.SensorCreated, {
      date,
      nodeId,
      ownerIds,
      location,
      legalBase,
      active,
      typeName,
      typeDetails
    });
  }
}
