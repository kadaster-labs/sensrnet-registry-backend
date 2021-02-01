import { EventMessage } from './event-message';

export abstract class Event {
  public readonly version: string;
  public readonly aggregateId: string;

  protected constructor(aggregateId: string, version: string) {
    this.version = version;
    this.aggregateId = aggregateId;
  }

  abstract streamRoot(): string;

  toEventMessage(): EventMessage {
    const { version, ...eventData } = this;

    return new EventMessage(
        `${this.streamRoot()}-${this.aggregateId}`,
        this.constructor.name,
        eventData,
        {version},
    );
  }
}
