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

  subscribeToStream(streamName: string, onEvent) {
    const timeoutMs = process.env.EVENT_STORE_TIMEOUT ? Number(process.env.EVENT_STORE_TIMEOUT) : 10000;

    const timeout = setTimeout(() => {
      this.logger.error(`Failed to connect to EventStore. Exiting.`);
      process.exit(0);
    }, timeoutMs);

    const onDropped = () => {
      this.logger.warn(`Event stream dropped. Retrying in ${timeoutMs}ms.`);
      setTimeout(() => this.subscribeToStream(streamName, onEvent), timeoutMs);
    };

    this.eventStore.subscribeToStream(streamName, onEvent, onDropped)
        .then(() => clearTimeout(timeout), () => this.logger.error('Failed to subscribe to stream.'));
  }

  async deleteStream(streamName: string, hardDelete?: boolean) {
    return await this.eventStore.deleteStream(streamName, hardDelete);
  }
}
