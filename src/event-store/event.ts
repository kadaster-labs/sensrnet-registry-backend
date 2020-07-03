import { EventMessage } from './event-message';

export abstract class Event {
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
  }

  abstract streamRoot(): string;

  toEventMessage(): EventMessage {
    return new EventMessage(
        `${this.streamRoot()}-${this.aggregateId}`,
        this.constructor.name,
        this,
    );
  }
}
