import { Module } from '@nestjs/common';
import { EventStore } from './event-store';
import { EventStoreConfiguration } from './event-store.configuration';
import { EventStorePublisher } from './event-store.publisher';

@Module({
    providers: [EventStore, EventStorePublisher, EventStoreConfiguration],
    exports: [EventStore, EventStorePublisher],
})
export class EventStoreModule {}
