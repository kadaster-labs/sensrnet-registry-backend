import { Event } from "../../../event-store/event";

export class SensorActivated extends Event {
  constructor(aggregatedId: string) {
    super(`sensor-${aggregatedId}`, SensorActivated.name, {
      sensorId: aggregatedId,
    });
  }
}
