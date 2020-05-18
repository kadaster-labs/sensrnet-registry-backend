import { IEvent } from '@nestjs/cqrs';

export class SensorWelcomedEvent implements IEvent {
  constructor(
    public readonly sensorId: string) {}
}
