import { EventStore } from "./event-store";
import { isValidEvent } from "./event-utils";
import { Injectable, Logger } from "@nestjs/common";
import { IEvent, IEventPublisher } from "@nestjs/cqrs";


@Injectable()
export class EventStorePublisher implements IEventPublisher {
  constructor(private eventStore: EventStore) {
    this.eventStore.connect();
  }

  async publish<T extends IEvent>(event: T) {
    if (isValidEvent(event)) {
      await this.eventStore.createEvent(event);
    } else {
      Logger.warn(`Invalid event: ${JSON.stringify(event)}`);
    }
  }

  async subscribeToStream(streamName: string, onEvent, onDropped) {
    return await this.eventStore.subscribeToStream(streamName, onEvent, onDropped);
  }
}
