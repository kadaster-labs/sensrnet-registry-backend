import {TCPClient} from 'geteventstore-promise';
import {EventStoreConfiguration} from './event-store.configuration';
import {Injectable} from '@nestjs/common';
import {EventMessage} from './event-message';

@Injectable()
export class EventStore {
  private client!: TCPClient;

  constructor(private configuration: EventStoreConfiguration) {
  }

  connect() {
    this.client = new TCPClient(this.configuration.config);
  }

  close() {
    this.client.close();
  }

  async exists(streamName: string) {
    return await this.client.checkStreamExists(streamName);
  }

  async createEvent(event: EventMessage) {
    await this.client.writeEvent(
        event.streamId,
        event.eventType,
        event.data,
        event.metadata,
    );
  }

  async getEvents(streamName: string) {
    return await this.client.getAllStreamEvents(streamName);
  }

  async deleteStream(streamName: string, hardDelete?: boolean) {
    return await this.client.deleteStream(streamName, hardDelete);
  }

  async subscribeToStream(streamName: string, onEventAppeared, onDropped) {
    return await this.client.subscribeToStream(streamName, onEventAppeared, onDropped, true);
  }
}
