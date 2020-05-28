// export enum EventType {
//   Updated = "Updated",
//   Deleted = "Deleted",
//   Activated = "Activated",
//   Deactivated = "Deactivated",
//   SensorCreated = "SensorCreated",
//   OwnershipShared = "OwnershipShared",
//   LocationUpdated = "LocationUpdated",
//   DataStreamCreated = "DataStreamCreated",
//   DataStreamDeleted = "DataStreamDeleted",
//   OwnershipTransferred = "OwnershipTransferred"  
// }

import {
  SensorCreated,
  SensorUpdated,
  SensorDeleted,
  SensorActivated,
  SensorDeactivated,
  SensorOwnershipShared,
  SensorOwnershipTransferred,
  DataStreamCreated,
  DataStreamDeleted,
  SensorLocationUpdated
} from '.';
import { Logger } from "@nestjs/common"

class EventType {
  constructor() {
    this.add(SensorCreated)
    this.add(SensorUpdated)
    this.add(SensorDeleted)
    this.add(SensorActivated)
    this.add(SensorDeactivated)
    this.add(SensorLocationUpdated)
    this.add(SensorOwnershipShared)
    this.add(SensorOwnershipTransferred)
    this.add(DataStreamCreated)
    this.add(DataStreamDeleted)
  }

  private supportedTypes: { [key: string]: any; } = {}

  getType(eventType: string) {
    let t = this.supportedTypes[eventType]
    if (!t) Logger.warn(`Unsupported event received! eventType: ${eventType}`)
    return t
  }

  private add(event: any) {
    this.supportedTypes[event.name] = event
  }

}

export const eventType = new EventType()
