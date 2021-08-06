import { EventStore } from './event-store';
import { isValidEvent } from './event-utils';
import { Injectable, Logger } from '@nestjs/common';
import { IEvent, IEventPublisher } from '@nestjs/cqrs';
import { MappedEventAppearedCallback } from 'geteventstore-promise';
import { EventStoreCatchUpSubscription, LiveProcessingStartedCallback,
  SubscriptionDroppedCallback, DeleteResult } from 'node-eventstore-client';

@Injectable()
export class EventStorePublisher implements IEventPublisher {
  protected logger: Logger = new Logger(this.constructor.name);

  constructor(private eventStore: EventStore) {
    this.eventStore.connect();
  }

  async publish<T extends IEvent>(event: T): Promise<void> {
    if (isValidEvent(event)) {
      await this.eventStore.createEvent(event);
    } else {
      Logger.warn(`Invalid event: ${JSON.stringify(event)}`);
    }
  }

  subscribeToStreamFrom(streamName: string, fromEventNumber: number,
                        onEventAppeared: MappedEventAppearedCallback<EventStoreCatchUpSubscription>,
                        onLiveProcessingStarted: LiveProcessingStartedCallback,
                        onDropped: SubscriptionDroppedCallback<EventStoreCatchUpSubscription>): Promise<EventStoreCatchUpSubscription> {
    return this.eventStore.subscribeToStreamFrom(streamName, fromEventNumber, onEventAppeared, onLiveProcessingStarted, onDropped);
  }

  async deleteStream(streamName: string, hardDelete?: boolean): Promise<DeleteResult> {
    return this.eventStore.deleteStream(streamName, hardDelete);
  }
}
