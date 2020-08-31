import { v4 } from 'uuid';
import { EventMessage } from './event-message';

export const NODE_ID = process.env.NODE_ID || v4();

export abstract class Event {

  public readonly aggregateId: string;
  public readonly nodeId: string = NODE_ID;

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
