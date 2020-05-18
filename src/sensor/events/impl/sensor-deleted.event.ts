import { IEvent } from '@nestjs/cqrs';

export class SensorDeletedEvent implements IEvent {
  constructor(
    public readonly sensorId: string) {}
}