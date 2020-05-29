import {
  SensorRegistered,
  SensorUpdated,
  SensorDeleted,
  SensorActivated,
  SensorDeactivated,
  SensorOwnershipShared,
  SensorOwnershipTransferred,
  DatastreamAdded,
  DatastreamDeleted,
  SensorRelocated
} from '.';
import { Logger } from "@nestjs/common"

class EventType {
  constructor() {
    this.add(SensorRegistered)
    this.add(SensorUpdated)
    this.add(SensorDeleted)
    this.add(SensorActivated)
    this.add(SensorDeactivated)
    this.add(SensorRelocated)
    this.add(SensorOwnershipShared)
    this.add(SensorOwnershipTransferred)
    this.add(DatastreamAdded)
    this.add(DatastreamDeleted)
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
