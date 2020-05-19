import { IEvent } from '@nestjs/cqrs';


export class OwnerRemovedEvent implements IEvent {
  constructor(
    public readonly id: string) {}
}
