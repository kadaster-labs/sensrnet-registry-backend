import { OwnerRegistered } from "./registered.event"
import { OwnerUpdated } from "./updated.event"
import { OwnerDeleted } from "./deleted.event"
import { Logger } from "@nestjs/common"

class EventType {
  constructor() {
    this.add(OwnerRegistered)
    this.add(OwnerUpdated)
    this.add(OwnerDeleted)
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
