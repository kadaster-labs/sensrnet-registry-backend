import { Event } from '../../../event-store/event';

export class SensorOwnershipShared extends Event {
  constructor(aggregatedId: string, ownerIds: string[]) {
    super(`sensor-${aggregatedId}`, SensorOwnershipShared.name, {
      sensorId: aggregatedId,
      ownerIds,
    });
  }
}
