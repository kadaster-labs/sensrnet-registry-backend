import { EventMessage } from './event-message';

export abstract class Event {

  public readonly version: string;
  public readonly aggregateId: string;

  protected constructor(aggregateId: string, version: string) {
    this.version = version;
    this.aggregateId = aggregateId;
  }

  public static getStreamName(streamRoot: string, aggregateId: string): string {
    return `${streamRoot}-${aggregateId}`;
  }

  abstract streamRoot(): string;

  toEventMessage(): EventMessage {
    const { version, ...eventData } = this;

    return new EventMessage(
        Event.getStreamName(this.streamRoot(), this.aggregateId),
        this.constructor.name,
        eventData,
        {version},
    );
  }
}
