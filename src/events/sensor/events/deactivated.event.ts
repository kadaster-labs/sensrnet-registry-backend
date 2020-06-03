import { Event } from '../../../event-store/event';

export class SensorDeactivated extends Event {
  constructor(aggregatedId: string) {
    super(`sensor-${aggregatedId}`, SensorDeactivated.name, {
      sensorId: aggregatedId,
    });
  }
}
