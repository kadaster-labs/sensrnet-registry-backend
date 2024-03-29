import { Injectable } from '@nestjs/common';
import { Event, MappedEventAppearedCallback, TCPClient } from 'geteventstore-promise';
import {
    EventStoreCatchUpSubscription,
    LiveProcessingStartedCallback,
    SubscriptionDroppedCallback,
    DeleteResult,
    WriteResult,
    EventStoreSubscription,
} from 'node-eventstore-client';
import { EventMessage } from './event-message';
import { EventStoreConfiguration } from './event-store.configuration';

@Injectable()
export class EventStore {
    private client!: TCPClient;

    constructor(private configuration: EventStoreConfiguration) {}

    connect(): void {
        this.client = new TCPClient(this.configuration.config);
    }

    async exists(streamName: string): Promise<boolean> {
        return this.client.checkStreamExists(streamName);
    }

    async createEvent(event: EventMessage): Promise<WriteResult> {
        return this.client.writeEvent(event.streamId, event.eventType, event.data, event.metadata);
    }

    async getEvents(streamName: string): Promise<Event[]> {
        return this.client.getAllStreamEvents(streamName);
    }

    async deleteStream(streamName: string, hardDelete?: boolean): Promise<DeleteResult> {
        return this.client.deleteStream(streamName, hardDelete);
    }

    async subscribeToStream(
        streamName: string,
        onEventAppeared: MappedEventAppearedCallback<EventStoreSubscription>,
        onDropped: SubscriptionDroppedCallback<EventStoreSubscription>,
    ): Promise<EventStoreSubscription> {
        return this.client.subscribeToStream(streamName, onEventAppeared, onDropped, true);
    }

    async subscribeToStreamFrom(
        streamName: string,
        fromEventNumber: number,
        onEventAppeared: MappedEventAppearedCallback<EventStoreCatchUpSubscription>,
        onLiveProcessingStarted: LiveProcessingStartedCallback,
        onDropped: SubscriptionDroppedCallback<EventStoreCatchUpSubscription>,
    ): Promise<EventStoreCatchUpSubscription> {
        const settings = {
            readBatchSize: 1,
            resolveLinkTos: true,
        };

        return this.client.subscribeToStreamFrom(
            streamName,
            fromEventNumber,
            onEventAppeared,
            onLiveProcessingStarted,
            onDropped,
            settings,
        );
    }
}
