import { IEvent } from '@nestjs/cqrs';

export class EventMessage implements IEvent {
  constructor(
    public readonly streamId: string,
    public readonly eventType: string,
    public readonly data: object = {},
    public readonly metadata: object = {},
  ) {}
}
