import { Event } from "../../../event-store/event";

export class SensorOwnershipShared extends Event {
  constructor(aggregatedId: string, ownerIds: Array<string>) {
    super(`sensor-${aggregatedId}`, SensorOwnershipShared.name, {
      sensorId: aggregatedId,
      ownerIds
    });
  }
}
