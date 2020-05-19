import { IEvent } from '@nestjs/cqrs';


export class SensorRemovedEvent implements IEvent {
  constructor(
    public readonly id: string) {}
}
