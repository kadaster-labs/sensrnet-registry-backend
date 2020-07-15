import { EventStore } from './event-store';
import { isValidEvent } from './event-utils';
import { Injectable, Logger } from '@nestjs/common';
import { IEvent, IEventPublisher } from '@nestjs/cqrs';

@Injectable()
export class EventStorePublisher implements IEventPublisher {
  protected logger: Logger = new Logger(this.constructor.name);

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

  subscribeToStreamFrom(streamName, fromEventNumber, onEvent, onLiveProcessingStarted, onDropped) {
    return this.eventStore.subscribeToStreamFrom(streamName, fromEventNumber, onEvent, onLiveProcessingStarted, onDropped);
  }

  async deleteStream(streamName: string, hardDelete?: boolean) {
    return await this.eventStore.deleteStream(streamName, hardDelete);
  }
}
